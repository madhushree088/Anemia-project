export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface HealthAssessment {
  id: string;
  userId: string;
  hemoglobin: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  symptoms: string[];
  medicalHistory: string[];
  lifestyle: {
    exercise: string;
    diet: string;
    smoking: boolean;
    alcohol: boolean;
  };
  createdAt: string;
}

export interface AITestResult {
  id: string;
  userId: string;
  type: 'fingernail' | 'eyelid';
  imageUrl: string;
  result: {
    status: 'normal' | 'mild' | 'moderate' | 'severe';
    confidence: number;
    hemoglobinEstimate?: number;
  };
  createdAt: string;
}

export interface TestResult {
  id: string;
  userId: string;
  type: 'manual' | 'ai';
  status: 'normal' | 'mild' | 'moderate' | 'severe';
  hemoglobin: number;
  heartRate?: number;
  recommendations: string[];
  createdAt: string;
  aiResults?: {
    fingernail: { status: string; confidence: number; type: string };
    eyelid: { status: string; confidence: number; type: string };
    overallConfidence: number;
  };
  assessmentData?: any; // For manual assessment form data
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: string;
  rating: number;
  specialty: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface EducationalVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: 'causes' | 'nutrition' | 'exercise' | 'treatment';
  url: string;
}

export interface NutritionItem {
  id: string;
  name: string;
  ironContent: number;
  vitaminC: boolean;
  category: 'meat' | 'vegetables' | 'fruits' | 'grains' | 'dairy';
  description: string;
}