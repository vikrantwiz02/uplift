import { useState, useEffect } from 'react';
import { authManager } from '../lib/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState(authManager.getState());

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  return {
    ...authState,
    signUp: authManager.signUp.bind(authManager),
    signIn: authManager.signIn.bind(authManager),
    signOut: authManager.signOut.bind(authManager),
    updateProfile: authManager.updateProfile.bind(authManager),
    forgotPassword: authManager.forgotPassword.bind(authManager),
    resetPassword: authManager.resetPassword.bind(authManager),
  };
};