
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowLeft, User, Lock, KeyRound, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type AuthMode = 'login' | 'signup' | 'otp-verify';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithPassword, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signInWithPassword(email, password);
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
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
        throw error;
      }

      if (data?.error) {
        toast({
          title: "Signup failed",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Verification code sent!",
        description: "Check your email for the 6-digit code.",
      });
      setMode('otp-verify');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: {
          email,
          otp_code: otpCode,
          password,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        toast({
          title: "Verification failed",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Account created!",
        description: "You can now sign in with your email and password.",
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
      toast({
        title: "Error",
        description: error.message || "Failed to verify code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setDisplayName('');
    setOtpCode('');
  };

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
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
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
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
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
                    onChange={(e) => setPassword(e.target.value)}
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
                    onChange={(e) => setFirstName(e.target.value)}
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
                    onChange={(e) => setDisplayName(e.target.value)}
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
                    onChange={(e) => setEmail(e.target.value)}
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
                    onChange={(e) => setPassword(e.target.value)}
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
