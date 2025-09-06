import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Card, CardContent } from '../components/ui';
import { useAuthStore } from '../stores/authStore';
import { registerSchema } from '../utils/validation';
import { getErrorMessage } from '../utils/errorMessages';
import type { ZodIssue } from 'zod';

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const { register, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    
    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    // Validate form data
    const validationData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      dateOfBirth: new Date(formData.dateOfBirth),
    };
    
    const validationResult = registerSchema.safeParse(validationData);
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((err: ZodIssue) => {
        const field = err.path[0] as string;
        errors[field] = err.message;
      });
      setFieldErrors(errors);
      return;
    }
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        dateOfBirth: new Date(formData.dateOfBirth),
        avatar: undefined,
      }, formData.password);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-25 flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="py-12">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-apple">
              <span className="text-2xl font-bold text-white">FP</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Create account</h1>
            <p className="text-gray-500 text-balance">Join Family Points and start earning rewards</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange('name')}
              error={fieldErrors.name}
              required
            />
            <Input
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange('email')}
              error={fieldErrors.email}
              required
            />
            <Input
              type="date"
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChange={handleChange('dateOfBirth')}
              error={fieldErrors.dateOfBirth}
              required
            />
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange('password')}
              error={fieldErrors.password}
              required
            />
            <Input
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={fieldErrors.confirmPassword}
              required
            />
            
            <Button type="submit" className="w-full" loading={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}