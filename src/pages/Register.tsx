import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Card, CardContent } from '../components/ui';
import { useAuthStore } from '../stores/authStore';

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  
  const { register, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
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
      setError('Registration failed. Please try again.');
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
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange('name')}
              required
            />
            <Input
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange('email')}
              required
            />
            <Input
              type="date"
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChange={handleChange('dateOfBirth')}
              required
            />
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange('password')}
              required
            />
            <Input
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={error}
              required
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
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