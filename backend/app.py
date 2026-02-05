import base64
import io
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

try:
    import tensorflow as tf  # Optional; used if .h5 models are present
except Exception:  # pragma: no cover
    tf = None  # type: ignore


class PatientInfo(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    symptoms: Optional[list[str]] = []


class PredictRequest(BaseModel):
    imageData: str  # base64 (no data: prefix)
    imageType: str  # 'eyelid' | 'fingernail'
    patientInfo: Optional[PatientInfo] = None


app = FastAPI(title="Anemia ML API")

# CORS for Vite dev and typical localhost ports
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Optional TensorFlow models (loaded lazily)
_tf_eyelid_model = None
_tf_fingernail_model = None


# Eyelid model globals (PyTorch fallback)
_eyelid_model: Optional[torch.nn.Module] = None
_eyelid_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])


def _load_eyelid_model_if_needed() -> None:
    global _eyelid_model
    if _eyelid_model is not None:
        return

    # Match training script: resnet18 with fc adjusted to number of classes (2)
    model = models.resnet18(pretrained=False)
    model.fc = nn.Linear(model.fc.in_features, 2)

    weights_path = "backend/model/eyelid/eyelid_model.pth"
    try:
        state = torch.load(weights_path, map_location=torch.device("cpu"))
        model.load_state_dict(state, strict=False)
    except Exception as exc:
        raise RuntimeError(f"Failed to load eyelid model weights at {weights_path}: {exc}")

    model.eval()
    _eyelid_model = model


def _predict_eyelid(image: Image.Image) -> tuple[str, float]:
    # Prefer TensorFlow .h5 if available
    global _tf_eyelid_model
    if tf is not None and _tf_eyelid_model is None:
        h5_path = "backend/model/eyelid/eyelid_cnn_mobilenetv2.h5"
        try:
            _tf_eyelid_model = tf.keras.models.load_model(h5_path)
        except Exception:
            _tf_eyelid_model = None

    if tf is not None and _tf_eyelid_model is not None:
        img = image.convert("RGB").resize((224, 224))
        arr = tf.keras.preprocessing.image.img_to_array(img) / 255.0
        arr = tf.expand_dims(arr, axis=0)
        prob_anemia = float(_tf_eyelid_model.predict(arr, verbose=0)[0][0])
        status = "severe" if prob_anemia >= 0.5 else "normal"
        confidence = prob_anemia if status == "severe" else 1.0 - prob_anemia
        return status, confidence

    # Fallback to PyTorch
    _load_eyelid_model_if_needed()
    assert _eyelid_model is not None
    tensor = _eyelid_transform(image).unsqueeze(0)
    with torch.no_grad():
        logits = _eyelid_model(tensor)
        probs = torch.softmax(logits, dim=1)[0]
        confidence, pred_idx = torch.max(probs, dim=0)
    status = "severe" if int(pred_idx.item()) == 0 else "normal"
    return status, float(confidence.item())


def _predict_fingernail(image: Image.Image) -> tuple[str, float]:
    # Prefer TensorFlow .h5 if available
    global _tf_fingernail_model
    if tf is not None and _tf_fingernail_model is None:
        h5_path = "backend/model/fingernail/fingernail_cnn_mobilenetv2.h5"
        try:
            _tf_fingernail_model = tf.keras.models.load_model(h5_path)
        except Exception:
            _tf_fingernail_model = None

    if tf is not None and _tf_fingernail_model is not None:
        img = image.convert("RGB").resize((224, 224))
        arr = tf.keras.preprocessing.image.img_to_array(img) / 255.0
        arr = tf.expand_dims(arr, axis=0)
        prob_anemia = float(_tf_fingernail_model.predict(arr, verbose=0)[0][0])
        # Map to statuses closer to UI expectations
        if prob_anemia >= 0.7:
            return "moderate", prob_anemia
        elif prob_anemia >= 0.5:
            return "mild", prob_anemia
        else:
            return "normal", 1.0 - prob_anemia

    # Fallback heuristic: average redness
    image = image.convert("RGB").resize((224, 224))
    pixels = torch.from_numpy(torch.ByteTensor(bytearray(image.tobytes())).numpy()).float()
    pixels = pixels.view(224 * 224, 3)
    mean_rgb = pixels.mean(dim=0)
    r, g, b = mean_rgb.tolist()
    redness_score = (r - (g + b) / 2.0) / 255.0
    if redness_score < 0.02:
        return "moderate", 0.7
    elif redness_score < 0.06:
        return "mild", 0.75
    else:
        return "normal", 0.8


def _decode_image(base64_str: str) -> Image.Image:
    try:
        image_bytes = base64.b64decode(base64_str)
        return Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid image data: {exc}")


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/predict")
def predict(req: PredictRequest) -> dict:
    image = _decode_image(req.imageData)

    if req.imageType not in ("eyelid", "fingernail"):
        raise HTTPException(status_code=400, detail="imageType must be 'eyelid' or 'fingernail'")

    if req.imageType == "eyelid":
        status, confidence = _predict_eyelid(image)
    else:
        status, confidence = _predict_fingernail(image)

    return {
        "prediction": {
            "status": status,
            "confidence": round(confidence, 4),
        }
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=True)


