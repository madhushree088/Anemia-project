// Debug Firebase and add sample data
import { db, isFirebaseEnabled } from '../lib/firebase';
import { collection, addDoc, getDocs, query, limit, serverTimestamp } from 'firebase/firestore';
import { FirestoreService } from '../services/firestoreService';

export const debugFirebase = async () => {
  console.log('=== FIREBASE DEBUG INFORMATION ===');
  console.log('Firebase enabled:', isFirebaseEnabled);
  console.log('DB instance exists:', !!db);
  console.log('Environment variables:');
  console.log('  API Key set:', !!import.meta.env.VITE_FIREBASE_API_KEY);
  console.log('  Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
  console.log('  Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
  
  if (isFirebaseEnabled && db) {
    try {
      console.log('Testing Firestore connection...');
      
      // Try to write a test document
      const testResult = {
        testType: 'connection-test',
        timestamp: serverTimestamp(),
        message: 'Firebase connection test'
      };
      
      const docRef = await addDoc(collection(db, 'testResults'), testResult);
      console.log('✅ Successfully wrote test document with ID:', docRef.id);
      
      // Try to read from Firestore
      const q = query(collection(db, 'testResults'), limit(5));
      const querySnapshot = await getDocs(q);
      console.log('✅ Successfully read', querySnapshot.size, 'documents from Firestore');
      
      // List documents
      const docs: Array<{id: string, data: any}> = [];
      querySnapshot.forEach((doc) => {
        docs.push({
          id: doc.id,
          data: doc.data()
        });
      });
      console.log('Documents found:', docs);
      
    } catch (error: any) {
      console.error('❌ Firebase connection test failed:', error);
      console.error('Error details:', {
        code: error?.code || 'unknown',
        message: error?.message || 'unknown error'
      });
    }
  } else {
    console.log('❌ Firebase not properly configured');
  }
  
  console.log('=== END FIREBASE DEBUG ===');
};

export const addSampleData = () => {
  const sampleResults = [
    {
      id: 'sample-1',
      userId: 'demo-user',
      type: 'manual',
      status: 'normal',
      hemoglobin: 13.2,
      recommendations: ['Normal hemoglobin levels detected', 'Maintain balanced diet', 'Regular exercise is beneficial'],
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'sample-2',
      userId: 'demo-user',
      type: 'ai',
      status: 'mild',
      hemoglobin: 11.8,
      recommendations: ['AI analysis suggests mild anemia', 'Increase iron-rich foods', 'Consider consulting a healthcare provider'],
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      aiResults: {
        fingernail: { status: 'mild', confidence: 0.82, type: 'fingernail' },
        eyelid: { status: 'normal', confidence: 0.88, type: 'eyelid' },
        overallConfidence: 0.85
      }
    },
    {
      id: 'sample-3',
      userId: 'demo-user',
      type: 'ai',
      status: 'normal',
      hemoglobin: 14.1,
      recommendations: ['AI analysis suggests normal iron levels', 'Continue maintaining balanced diet'],
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      aiResults: {
        fingernail: { status: 'normal', confidence: 0.91, type: 'fingernail' },
        eyelid: { status: 'normal', confidence: 0.89, type: 'eyelid' },
        overallConfidence: 0.90
      }
    }
  ];

  localStorage.setItem('testResults', JSON.stringify(sampleResults));
  console.log('Sample data added:', sampleResults.length, 'results');
  return sampleResults;
};

export const clearTestData = () => {
  localStorage.removeItem('testResults');
  console.log('Test data cleared');
};

// Test if results are being saved to Firebase
export const testResultStorage = async () => {
  console.log('=== TESTING RESULT STORAGE ===');
  
  const testResult = {
    userId: 'test-user-' + Date.now(),
    type: 'manual' as const,
    status: 'normal' as const,
    hemoglobin: 13.5,
    recommendations: ['Test recommendation'],
  };
  
  try {
    console.log('Attempting to save test result...');
    const savedResult = await FirestoreService.saveTestResult(testResult);
    
    if (savedResult) {
      console.log('✅ Test result saved to Firebase with ID:', savedResult);
    } else {
      console.log('⚠️ Test result not saved to Firebase (fallback to localStorage)');
    }
    
    // Check localStorage
    const localResults = JSON.parse(localStorage.getItem('testResults') || '[]');
    console.log('LocalStorage contains', localResults.length, 'results');
    
    return savedResult;
  } catch (error: any) {
    console.error('❌ Failed to save test result:', error);
    console.error('Error details:', {
      code: error?.code || 'unknown',
      message: error?.message || 'unknown error'
    });
    return null;
  }
};

// Test loading results from Firebase
export const testResultLoading = async (userId?: string) => {
  console.log('=== TESTING RESULT LOADING ===');
  
  try {
    console.log('Attempting to load results from Firebase...');
    const results = await FirestoreService.getUserTestResults(userId || 'test-user');
    console.log('✅ Loaded', results.length, 'results from Firebase');
    
    // Also test localStorage
    const localResults = JSON.parse(localStorage.getItem('testResults') || '[]');
    console.log('LocalStorage contains', localResults.length, 'results');
    
    return { firebaseResults: results, localResults };
  } catch (error: any) {
    console.error('❌ Failed to load results from Firebase:', error);
    return { firebaseResults: [], localResults: [] };
  }
};