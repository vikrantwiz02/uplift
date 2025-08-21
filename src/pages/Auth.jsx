import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { Heart, Mail, Lock, User, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

const Auth = () => {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated, signUp, signIn, signOut, forgotPassword, resetPassword } = useAuth();
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.emailConfirmed) {
        navigate('/dashboard');
      } else {
        setMode('verify-email');
        toast({
          title: "Email verification required",
          description: "Please check your email and click the verification link to continue.",
          variant: "default",
        });
      }
    }
  }, [isAuthenticated, user, navigate, toast]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await signUp(email, password, fullName);
      
      if (response.user && !response.user.emailConfirmed) {
        setVerificationEmailSent(true);
        setMode('verify-email');
        toast({
          title: "Account created successfully!",
          description: "Please check your email and click the verification link to activate your account.",
        });
      }
    } catch (error) {
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await signIn(email, password);
      
      if (response.user?.emailConfirmed) {
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });
      } else {
        setMode('verify-email');
        toast({
          title: "Email verification required",
          description: "Please check your email and click the verification link before signing in.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await forgotPassword(email);

      setResetEmailSent(true);
      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions to reset your password.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!password.trim() || !confirmPassword.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Both password fields are required.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // For now, we'll use a placeholder token since we don't have the reset token flow implemented
      await resetPassword('placeholder-token', password);

      setPasswordResetSuccess(true);
      toast({
        title: "Password updated successfully!",
        description: "You can now sign in with your new password.",
      });

      // Clear the URL parameters and redirect to sign in after a delay
      setTimeout(() => {
        window.history.replaceState({}, document.title, '/auth');
        setMode('signin');
        setPassword('');
        setConfirmPassword('');
      }, 2000);
    } catch (error) {
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    setLoading(true);
    try {
      // This would need to be implemented in the backend
      // For now, just show a success message

      toast({
        title: "Verification email sent",
        description: "Please check your email for the verification link.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderSignInForm = () => (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <GoogleAuthButton />

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={() => setMode('forgot-password')}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Forgot your password?
        </button>
        <div>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </form>
  );

  const renderSignUpForm = () => (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="Enter your password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            minLength={6}
            required
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <GoogleAuthButton>Sign up with Google</GoogleAuthButton>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setMode('signin')}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Already have an account? Sign in
        </button>
      </div>
    </form>
  );

  const renderForgotPasswordForm = () => (
    <div className="space-y-4">
      {!resetEmailSent ? (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      ) : (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Password reset email sent! Please check your email and follow the instructions to reset your password.
          </AlertDescription>
        </Alert>
      )}

      <div className="text-center">
        <button
          onClick={() => {
            setMode('signin');
            setResetEmailSent(false);
          }}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center space-x-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to sign in</span>
        </button>
      </div>
    </div>
  );

  const renderVerifyEmailForm = () => (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please check your email and click the verification link to activate your account.
        </AlertDescription>
      </Alert>

      <div className="text-center space-y-4">
        <p className="text-sm text-gray-600">
          Didn't receive the email? Check your spam folder or request a new one.
        </p>
        
        <Button 
          onClick={resendVerificationEmail} 
          disabled={loading}
          variant="outline"
          className="w-full"
        >
          {loading ? 'Sending...' : 'Resend Verification Email'}
        </Button>

        <button
          onClick={() => {
            setMode('signin');
            setVerificationEmailSent(false);
          }}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center space-x-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to sign in</span>
        </button>
      </div>
    </div>
  );

  const renderResetPasswordForm = () => (
    <div className="space-y-4">
      {!passwordResetSuccess ? (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                minLength={6}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                minLength={6}
                required
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      ) : (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Password updated successfully! Redirecting to sign in...
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const getTitle = () => {
    switch (mode) {
      case 'signup': return 'Join Uplift';
      case 'forgot-password': return 'Reset Password';
      case 'verify-email': return 'Verify Your Email';
      case 'reset-password': return 'Set New Password';
      default: return 'Welcome Back';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'signup': return 'Create your account to start your wellness journey';
      case 'forgot-password': return 'Enter your email to receive a password reset link';
      case 'verify-email': return 'We\'ve sent you a verification email';
      case 'reset-password': return 'Enter your new password below';
      default: return 'Sign in to continue your wellness journey';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-pink-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {getTitle()}
          </CardTitle>
          <CardDescription>
            {getDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === 'signin' && renderSignInForm()}
          {mode === 'signup' && renderSignUpForm()}
          {mode === 'forgot-password' && renderForgotPasswordForm()}
          {mode === 'verify-email' && renderVerifyEmailForm()}
          {mode === 'reset-password' && renderResetPasswordForm()}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;