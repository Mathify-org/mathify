import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowLeft, User, Lock, KeyRound, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type AuthMode = 'login' | 'signup' | 'otp-verify' | 'forgot-password' | 'reset-password';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { signInWithPassword, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle reset password mode from URL
  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode === 'reset-password') {
      setMode('reset-password');
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (user && mode !== 'reset-password') {
      navigate('/');
    }
  }, [user, navigate, mode]);

  const clearError = () => setErrorMessage('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    try {
      const { error } = await signInWithPassword(email, password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrorMessage('Incorrect email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          setErrorMessage('Please verify your email before signing in.');
        } else {
          setErrorMessage(error.message);
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
        navigate('/');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!firstName.trim()) {
      setErrorMessage('Please enter your first name.');
      return;
    }

    if (!displayName.trim()) {
      setErrorMessage('Please choose a display name.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: {
          email,
          password,
          first_name: firstName,
          display_name: displayName,
        },
      });

      if (error) {
        setErrorMessage('We couldn\'t send the verification code. Please try again.');
        return;
      }

      if (data?.error) {
        setErrorMessage(data.error);
        return;
      }

      toast({
        title: "Verification code sent!",
        description: "Check your email for the 6-digit code.",
      });
      setMode('otp-verify');
    } catch (error: any) {
      console.error('Signup error:', error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: {
          email,
          otp_code: otpCode,
          password,
        },
      });

      if (error) {
        setErrorMessage('Verification failed. Please try again.');
        return;
      }

      if (data?.error) {
        setErrorMessage(data.error);
        return;
      }

      toast({
        title: "Account created!",
        description: "Welcome to Mathify! Signing you in...",
      });
      
      // Auto sign in after successful verification
      const { error: signInError } = await signInWithPassword(email, password);
      if (!signInError) {
        navigate('/');
      } else {
        setMode('login');
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('forgot-password', {
        body: { email },
      });

      if (error) {
        setErrorMessage('We couldn\'t process your request. Please try again.');
        return;
      }

      if (data?.error) {
        setErrorMessage(data.error);
        return;
      }

      toast({
        title: "Check your email",
        description: "If an account exists, you'll receive a password reset link.",
      });
      setMode('login');
    } catch (error: any) {
      console.error('Forgot password error:', error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        if (error.message.includes('same password')) {
          setErrorMessage('Please choose a different password than your current one.');
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      toast({
        title: "Password updated!",
        description: "You can now sign in with your new password.",
      });
      setMode('login');
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Reset password error:', error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setDisplayName('');
    setOtpCode('');
    clearError();
  };

  // Error Alert Component
  const ErrorAlert = () => errorMessage ? (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
      {errorMessage}
    </div>
  ) : null;

  // Reset Password View
  if (mode === 'reset-password') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Lock className="mx-auto h-12 w-12 text-purple-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Create new password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your new password below
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <ErrorAlert />
            <div className="space-y-4">
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="newPassword"
                    type="password"
                    required
                    minLength={6}
                    className="pl-10"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    minLength={6}
                    className="pl-10"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); clearError(); }}
                  />
                </div>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Forgot Password View
  if (mode === 'forgot-password') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Mail className="mx-auto h-12 w-12 text-purple-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Forgot password?</h2>
            <p className="mt-2 text-sm text-gray-600">
              No worries! Enter your email and we'll send you a reset link.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
            <ErrorAlert />
            <div>
              <Label htmlFor="resetEmail">Email address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="resetEmail"
                  type="email"
                  required
                  className="pl-10"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError(); }}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
          <Button
            onClick={() => {
              setMode('login');
              clearError();
            }}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Button>
        </div>
      </div>
    );
  }

  // OTP Verification View
  if (mode === 'otp-verify') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <KeyRound className="mx-auto h-12 w-12 text-purple-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Enter verification code</h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a 6-digit code to <strong>{email}</strong>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
            <ErrorAlert />
            <div>
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                required
                className="mt-1 text-center text-2xl tracking-widest"
                placeholder="000000"
                value={otpCode}
                onChange={(e) => { setOtpCode(e.target.value.replace(/\D/g, '')); clearError(); }}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || otpCode.length !== 6}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Create Account"
              )}
            </Button>
          </form>
          <Button
            onClick={() => {
              setMode('signup');
              setOtpCode('');
              clearError();
            }}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign up
          </Button>
          <p className="text-center text-sm text-gray-500">
            Didn't receive the code? Check your spam folder or{' '}
            <button
              onClick={() => handleSignup({ preventDefault: () => {} } as React.FormEvent)}
              className="text-purple-600 hover:underline"
              disabled={isLoading}
            >
              resend code
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img 
            src="/lovable-uploads/471e55df-9e2d-4051-b312-93edbd1dc0f0.png" 
            alt="Mathify Logo" 
            className="mx-auto h-16 w-16"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {mode === 'login' ? 'Welcome back!' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'login' 
              ? 'Sign in to continue your learning journey' 
              : 'Join Mathify and start learning today'}
          </p>
        </div>

        <ErrorAlert />

        {mode === 'login' ? (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot-password'); clearError(); }}
                    className="text-sm text-purple-600 hover:text-purple-500"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="pl-10"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  />
                </div>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="firstName"
                    type="text"
                    required
                    className="pl-10"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); clearError(); }}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="displayName"
                    type="text"
                    required
                    className="pl-10"
                    placeholder="Choose a display name"
                    value={displayName}
                    onChange={(e) => { setDisplayName(e.target.value); clearError(); }}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="signupEmail">Email address</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="signupEmail"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="signupPassword">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="signupPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    className="pl-10"
                    placeholder="Create a password (min 6 characters)"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  />
                </div>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending code...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </form>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setMode('signup');
                    resetForm();
                  }}
                  className="font-medium text-purple-600 hover:text-purple-500"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setMode('login');
                    resetForm();
                  }}
                  className="font-medium text-purple-600 hover:text-purple-500"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
