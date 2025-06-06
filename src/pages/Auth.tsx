
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowLeft } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { signInWithMagicLink, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signInWithMagicLink(email);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setEmailSent(true);
        toast({
          title: "Check your email!",
          description: "We've sent you a magic link to sign in.",
        });
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

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Mail className="mx-auto h-12 w-12 text-purple-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Check your email</h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a magic link to <strong>{email}</strong>
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Click the link in your email to sign in. You can close this tab.
            </p>
          </div>
          <Button
            onClick={() => setEmailSent(false)}
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img 
            src="/lovable-uploads/471e55df-9e2d-4051-b312-93edbd1dc0f0.png" 
            alt="Mathify Logo" 
            className="mx-auto h-16 w-16"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome to Mathify</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in with your email to get started
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:opacity-90"
          >
            {isLoading ? "Sending..." : "Send Magic Link"}
          </Button>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-500">
            We'll send you a secure link to sign in without a password
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
