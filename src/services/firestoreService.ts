import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db, isFirebaseEnabled } from '../lib/firebase';
import { TestResult, User } from '../types';

export class FirestoreService {
  // Save test result to Firestore
  static async saveTestResult(result: Omit<TestResult, 'id' | 'createdAt'>): Promise<string | null> {
    if (!isFirebaseEnabled || !db) {
      console.warn('Firestore not available, falling back to localStorage');
      return null;
    }

    try {
      const docRef = await addDoc(collection(db, 'testResults'), {
        ...result,
        createdAt: serverTimestamp(),
      });
      
      console.log('Test result saved to Firestore with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving test result to Firestore:', error);
      throw error;
    }
  }

  // Get user's test results from Firestore
  static async getUserTestResults(userId: string): Promise<TestResult[]> {
    if (!isFirebaseEnabled || !db) {
      console.warn('Firestore not available');
      return [];
    }

    try {
      const q = query(
        collection(db, 'testResults'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const results: TestResult[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate().toISOString()
          : new Date().toISOString();
          
        results.push({
          id: doc.id,
          ...data,
          createdAt,
        } as TestResult);
      });
      
      console.log(`Loaded ${results.length} test results from Firestore for user ${userId}`);
      return results;
    } catch (error) {
      console.error('Error loading test results from Firestore:', error);
      return [];
    }
  }

  // Get all test results (admin function)
  static async getAllTestResults(): Promise<TestResult[]> {
    if (!isFirebaseEnabled || !db) {
      console.warn('Firestore not available');
      return [];
    }

    try {
      const q = query(
        collection(db, 'testResults'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const results: TestResult[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate().toISOString()
          : new Date().toISOString();
          
        results.push({
          id: doc.id,
          ...data,
          createdAt,
        } as TestResult);
      });
      
      console.log(`Loaded ${results.length} total test results from Firestore`);
      return results;
    } catch (error) {
      console.error('Error loading all test results from Firestore:', error);
      return [];
    }
  }

  // Save user profile data
  static async saveUserProfile(userId: string, userData: Partial<User>): Promise<void> {
    if (!isFirebaseEnabled || !db) {
      console.warn('Firestore not available');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userId), {
        ...userData,
        updatedAt: serverTimestamp(),
      });
      
      console.log('User profile updated in Firestore');
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Delete test result
  static async deleteTestResult(resultId: string): Promise<void> {
    if (!isFirebaseEnabled || !db) {
      console.warn('Firestore not available');
      return;
    }

    try {
      await deleteDoc(doc(db, 'testResults', resultId));
      console.log('Test result deleted from Firestore');
    } catch (error) {
      console.error('Error deleting test result:', error);
      throw error;
    }
  }
}

// Helper function to save results with fallback to localStorage
export const saveTestResultWithFallback = async (result: Omit<TestResult, 'id' | 'createdAt'>) => {
  const localResult = {
    ...result,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };

  // Always save to localStorage first
  const existingResults = JSON.parse(localStorage.getItem('testResults') || '[]');
  existingResults.unshift(localResult);
  localStorage.setItem('testResults', JSON.stringify(existingResults));
  console.log('Test result saved to localStorage');

  // Try to save to Firestore if available
  try {
    const firestoreId = await FirestoreService.saveTestResult(result);
    if (firestoreId) {
      console.log('Test result also saved to Firestore with ID:', firestoreId);
    }
  } catch (error) {
    console.warn('Failed to save to Firestore, but localStorage save succeeded:', error);
  }

  return localResult;
};

// Helper function to load results with fallback to localStorage
export const loadTestResultsWithFallback = async (userId?: string): Promise<TestResult[]> => {
  let firestoreResults: TestResult[] = [];
  
  // Try to load from Firestore first
  if (userId && isFirebaseEnabled) {
    try {
      firestoreResults = await FirestoreService.getUserTestResults(userId);
    } catch (error) {
      console.warn('Failed to load from Firestore, using localStorage only:', error);
    }
  }

  // Load from localStorage
  const localResults: TestResult[] = JSON.parse(localStorage.getItem('testResults') || '[]');
  
  // Filter local results by user if needed
  const filteredLocalResults = userId 
    ? localResults.filter(result => result.userId === userId)
    : localResults;

  // Combine and deduplicate results
  const allResults = [...firestoreResults, ...filteredLocalResults];
  const uniqueResults = allResults.filter((result, index, self) => 
    index === self.findIndex(r => r.id === result.id)
  );

  // Sort by date (newest first)
  uniqueResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  console.log(`Loaded ${uniqueResults.length} total results (${firestoreResults.length} from Firestore, ${filteredLocalResults.length} from localStorage)`);
  
  return uniqueResults;
};