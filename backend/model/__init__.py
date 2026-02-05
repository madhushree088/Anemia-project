import os
from typing import Optional, Tuple

import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image


# Paths to saved models
EYELID_MODEL_PATH = os.path.join(os.path.dirname(__file__), "eyelid", "eyelid_model.pth")


# Lazily loaded eyelid model (PyTorch)
_eyelid_model: Optional[torch.nn.Module] = None
_eyelid_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])


def load_eyelid_model() -> torch.nn.Module:
    global _eyelid_model
    if _eyelid_model is not None:
        return _eyelid_model

    model = models.resnet18(pretrained=False)
    model.fc = nn.Linear(model.fc.in_features, 2)

    state = torch.load(EYELID_MODEL_PATH, map_location=torch.device("cpu"))
    model.load_state_dict(state, strict=False)
    model.eval()
    _eyelid_model = model
    return _eyelid_model


def predict_eyelid_from_pil(image: Image.Image) -> Tuple[str, float]:
    model = load_eyelid_model()
    tensor = _eyelid_transform(image.convert("RGB")).unsqueeze(0)
    with torch.no_grad():
        logits = model(tensor)
        probs = torch.softmax(logits, dim=1)[0]
        confidence, pred_idx = torch.max(probs, dim=0)

    # Assume class index 0 → anemia, 1 → normal (alphabetical order of ImageFolder)
    status = "severe" if int(pred_idx.item()) == 0 else "normal"
    return status, float(confidence.item())


def get_model_info():
    return {
        "eyelid_model": EYELID_MODEL_PATH,
    }
