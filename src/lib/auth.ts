import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  UserCredential
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export const handleAuthError = (error: any) => {
  const code = error.code;
  switch (code) {
    case 'auth/invalid-credential':
      return 'Your email or password is incorrect. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Your password should be at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'The sign-in popup was closed before completing.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/invalid-email':
      return 'The email address is invalid.';
    default:
      return 'An unexpected authentication error occurred. Please try again.';
  }
};

export const loginWithGoogle = async (): Promise<UserCredential | null> => {
  if (!auth || !googleProvider) throw new Error("Firebase not initialized");
  return signInWithPopup(auth, googleProvider);
};

export const logoutUser = async (): Promise<void> => {
  if (!auth) throw new Error("Firebase not initialized");
  return signOut(auth);
};
