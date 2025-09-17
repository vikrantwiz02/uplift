import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authManager } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      toast({
        title: "Authentication Failed",
        description: "There was an error signing in with Google. Please try again.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        
        // Store the token in localStorage
        localStorage.setItem('auth_token', token);
        
        // Set the token in API client
        apiClient.setToken(token);
        
        // Update auth state
        authManager.setState({
          user,
          token,
          isAuthenticated: true
        });

        toast({
          title: "Welcome!",
          description: `Successfully signed in as ${user.name}`,
        });

        navigate('/dashboard');
      } catch (error) {
        console.error('Error parsing user data:', error);
        toast({
          title: "Authentication Error",
          description: "There was an error processing your authentication. Please try again.",
          variant: "destructive",
        });
        navigate('/auth');
      }
    } else {
      toast({
        title: "Authentication Error",
        description: "Invalid authentication response. Please try again.",
        variant: "destructive",
      });
      navigate('/auth');
    }
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;
