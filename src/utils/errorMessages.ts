export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'code' in error) {
    const firebaseError = error as { code: string; message: string };
    
    switch (firebaseError.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials and try again.';
      
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please try logging in instead.';
      
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection and try again.';
      
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      
      case 'permission-denied':
        return 'You do not have permission to perform this action.';
      
      case 'unavailable':
        return 'Service is temporarily unavailable. Please try again later.';
      
      case 'not-found':
        return 'The requested resource was not found.';
      
      default:
        if (process.env.NODE_ENV === 'development') {
          return firebaseError.message || 'An unexpected error occurred.';
        }
        return 'An unexpected error occurred. Please try again.';
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('User not authenticated')) {
      return 'Please log in to continue.';
    }
    
    if (error.message.includes('Invalid invite code')) {
      return 'The invite code you entered is invalid or has expired.';
    }
    
    if (error.message.includes('already a member')) {
      return 'You are already a member of this group.';
    }

    if (process.env.NODE_ENV === 'development') {
      return error.message;
    }
  }

  return 'An unexpected error occurred. Please try again.';
};