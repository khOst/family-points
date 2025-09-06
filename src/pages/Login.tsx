import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Card, CardContent } from '../components/ui';
import { useAuthStore } from '../stores/authStore';
import { loginSchema } from '../utils/validation';
import { getErrorMessage } from '../utils/errorMessages';
import type { ZodIssue } from 'zod';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    
    // Validate form data
    const validationResult = loginSchema.safeParse({ email, password });
    if (!validationResult.success) {
      const errors: { email?: string; password?: string } = {};
      validationResult.error.issues.forEach((err: ZodIssue) => {
        if (err.path[0] === 'email') errors.email = err.message;
        if (err.path[0] === 'password') errors.password = err.message;
      });
      setFieldErrors(errors);
      return;
    }
    
    try {
      await login(email, password);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-gray-25 flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardContent className="py-12">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-apple">
              <span className="text-2xl font-bold text-white">FP</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Welcome back</h1>
            <p className="text-gray-500 text-balance">Sign in to your Family Points account</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
              required
            />
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
              required
            />
            
            <Button type="submit" className="w-full" loading={isLoading}>
              {isLoading ? 'Signing In...' : 'Continue'}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}