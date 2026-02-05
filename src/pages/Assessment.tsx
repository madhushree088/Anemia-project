import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';
import { Textarea } from '../components/ui/Textarea';
import { Card } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress';
import { FileText, User, Activity, Heart, Utensils, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { saveTestResultWithFallback } from '../services/firestoreService';

interface AssessmentForm {
  // Personal Information
  hemoglobin: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  
  // Symptoms
  symptoms: string[];
  
  // Medical History
  medicalHistory: string[];
  additionalHistory: string;
  
  // Lifestyle
  exerciseFrequency: string;
  dietType: string;
  smoking: boolean;
  alcohol: boolean;
  sleepHours: number;
}

const SYMPTOMS = [
  'Fatigue or weakness',
  'Pale skin, nails, or inner eyelids',
  'Shortness of breath',
  'Dizziness or lightheadedness',
  'Cold hands and feet',
  'Brittle or spoon-shaped nails',
  'Unusual cravings for ice, starch, or dirt',
  'Rapid or irregular heartbeat',
  'Heavy menstrual periods',
  'Restless leg syndrome'
];

const MEDICAL_CONDITIONS = [
  'Chronic kidney disease',
  'Heart disease',
  'Inflammatory bowel disease',
  'Rheumatoid arthritis',
  'Cancer or cancer treatment',
  'Thyroid disorders',
  'Celiac disease',
  'Heavy menstrual bleeding',
  'Frequent blood donation',
  'Recent surgery or injury'
];

export const Assessment: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    trigger
  } = useForm<AssessmentForm>({
    defaultValues: {
      symptoms: [],
      medicalHistory: [],
      smoking: false,
      alcohol: false
    }
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof AssessmentForm)[] => {
    switch (step) {
      case 1:
        return ['hemoglobin', 'age', 'gender', 'weight', 'height'];
      case 2:
        return ['symptoms'];
      case 3:
        return ['medicalHistory'];
      case 4:
        return ['exerciseFrequency', 'dietType', 'sleepHours'];
      default:
        return [];
    }
  };

  const onSubmit = async (data: AssessmentForm) => {
    setIsSubmitting(true);
    
    try {
      // Calculate anemia status based on hemoglobin levels
      let status: 'normal' | 'mild' | 'moderate' | 'severe' = 'normal';
      const hemoglobin = data.hemoglobin;
      
      if (data.gender === 'female') {
        if (hemoglobin < 8) status = 'severe';
        else if (hemoglobin < 10) status = 'moderate';
        else if (hemoglobin < 12) status = 'mild';
      } else {
        if (hemoglobin < 8) status = 'severe';
        else if (hemoglobin < 10) status = 'moderate';
        else if (hemoglobin < 13) status = 'mild';
      }

      // Generate recommendations based on assessment
      const recommendations = generateRecommendations(data, status);
      
      // Save result using Firestore service with localStorage fallback
      await saveTestResultWithFallback({
        userId: user?.id || 'anonymous',
        type: 'manual',
        status,
        hemoglobin: data.hemoglobin,
        recommendations,
        assessmentData: data
      });
      
      console.log('Manual assessment result saved successfully');
      setIsSubmitting(false);
      navigate('/results');
    } catch (error) {
      console.error('Error saving assessment result:', error);
      setIsSubmitting(false);
      // Still navigate to results even if save fails, as localStorage fallback should work
      navigate('results');
    }
  };

  const generateRecommendations = (data: AssessmentForm, status: string): string[] => {
    const recommendations: string[] = [];
    
    if (status !== 'normal') {
      recommendations.push('Consult with a healthcare provider for proper diagnosis and treatment');
      recommendations.push('Consider iron-rich foods like lean meats, spinach, and legumes');
      recommendations.push('Pair iron-rich foods with vitamin C sources for better absorption');
    }
    
    if (data.symptoms.includes('Fatigue or weakness')) {
      recommendations.push('Ensure adequate rest and sleep (7-9 hours per night)');
    }
    
    if (data.exerciseFrequency === 'never') {
      recommendations.push('Start with light exercise like walking 15-20 minutes daily');
    }
    
    if (data.smoking) {
      recommendations.push('Consider smoking cessation programs to improve overall health');
    }
    
    if (data.sleepHours < 7) {
      recommendations.push('Aim for 7-9 hours of quality sleep each night');
    }
    
    return recommendations;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Hemoglobin Level (g/dL)"
                type="number"
                step="0.1"
                placeholder="12.5"
                error={errors.hemoglobin?.message}
                {...register('hemoglobin', {
                  required: 'Hemoglobin level is required',
                  min: { value: 5, message: 'Value must be at least 5' },
                  max: { value: 20, message: 'Value must be less than 20' }
                })}
              />
              
              <Input
                label="Age"
                type="number"
                placeholder="25"
                error={errors.age?.message}
                {...register('age', {
                  required: 'Age is required',
                  min: { value: 1, message: 'Age must be at least 1' },
                  max: { value: 120, message: 'Age must be less than 120' }
                })}
              />
              
              <Controller
                name="gender"
                control={control}
                rules={{ required: 'Gender is required' }}
                render={({ field }) => (
                  <Select
                    label="Gender"
                    options={[
                      { value: '', label: 'Select gender' },
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' }
                    ]}
                    error={errors.gender?.message}
                    {...field}
                  />
                )}
              />
              
              <Input
                label="Weight (kg)"
                type="number"
                step="0.1"
                placeholder="70"
                error={errors.weight?.message}
                {...register('weight', {
                  required: 'Weight is required',
                  min: { value: 20, message: 'Weight must be at least 20 kg' },
                  max: { value: 300, message: 'Weight must be less than 300 kg' }
                })}
              />
              
              <Input
                label="Height (cm)"
                type="number"
                placeholder="170"
                error={errors.height?.message}
                {...register('height', {
                  required: 'Height is required',
                  min: { value: 100, message: 'Height must be at least 100 cm' },
                  max: { value: 250, message: 'Height must be less than 250 cm' }
                })}
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <Activity className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Symptoms Assessment</h2>
            </div>
            
            <p className="text-gray-600 mb-4">
              Please select any symptoms you have experienced in the past month:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SYMPTOMS.map((symptom, index) => (
                <Controller
                  key={index}
                  name="symptoms"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      label={symptom}
                      checked={field.value?.includes(symptom)}
                      onChange={(e) => {
                        const updatedSymptoms = e.target.checked
                          ? [...(field.value || []), symptom]
                          : (field.value || []).filter(s => s !== symptom);
                        field.onChange(updatedSymptoms);
                      }}
                    />
                  )}
                />
              ))}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <Heart className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Medical History</h2>
            </div>
            
            <p className="text-gray-600 mb-4">
              Please select any medical conditions you have or have had:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {MEDICAL_CONDITIONS.map((condition, index) => (
                <Controller
                  key={index}
                  name="medicalHistory"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      label={condition}
                      checked={field.value?.includes(condition)}
                      onChange={(e) => {
                        const updatedHistory = e.target.checked
                          ? [...(field.value || []), condition]
                          : (field.value || []).filter(h => h !== condition);
                        field.onChange(updatedHistory);
                      }}
                    />
                  )}
                />
              ))}
            </div>
            
            <Textarea
              label="Additional Medical History"
              placeholder="Please describe any other relevant medical conditions, medications, or treatments..."
              rows={4}
              {...register('additionalHistory')}
            />
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <Utensils className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Lifestyle Assessment</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="exerciseFrequency"
                control={control}
                rules={{ required: 'Exercise frequency is required' }}
                render={({ field }) => (
                  <Select
                    label="Exercise Frequency"
                    options={[
                      { value: '', label: 'Select frequency' },
                      { value: 'daily', label: 'Daily' },
                      { value: '3-5-times', label: '3-5 times per week' },
                      { value: '1-2-times', label: '1-2 times per week' },
                      { value: 'rarely', label: 'Rarely' },
                      { value: 'never', label: 'Never' }
                    ]}
                    error={errors.exerciseFrequency?.message}
                    {...field}
                  />
                )}
              />
              
              <Controller
                name="dietType"
                control={control}
                rules={{ required: 'Diet type is required' }}
                render={({ field }) => (
                  <Select
                    label="Diet Type"
                    options={[
                      { value: '', label: 'Select diet type' },
                      { value: 'omnivore', label: 'Omnivore (eat everything)' },
                      { value: 'vegetarian', label: 'Vegetarian' },
                      { value: 'vegan', label: 'Vegan' },
                      { value: 'pescatarian', label: 'Pescatarian' },
                      { value: 'other', label: 'Other' }
                    ]}
                    error={errors.dietType?.message}
                    {...field}
                  />
                )}
              />
              
              <Input
                label="Average Sleep Hours per Night"
                type="number"
                step="0.5"
                placeholder="8"
                error={errors.sleepHours?.message}
                {...register('sleepHours', {
                  required: 'Sleep hours is required',
                  min: { value: 3, message: 'Must be at least 3 hours' },
                  max: { value: 12, message: 'Must be less than 12 hours' }
                })}
              />
            </div>
            
            <div className="space-y-4">
              <Controller
                name="smoking"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label="I currently smoke or use tobacco products"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
              
              <Controller
                name="alcohol"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label="I regularly consume alcohol (more than 2 drinks per week)"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Manual Health Assessment</h1>
        </div>
        <p className="text-gray-600">
          Complete this comprehensive questionnaire to assess your anemia risk and get personalized recommendations.
        </p>
      </div>

      <Card className="mb-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {renderStep()}
          
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                className="flex items-center space-x-2"
              >
                <span>{isSubmitting ? 'Processing...' : 'Complete Assessment'}</span>
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};