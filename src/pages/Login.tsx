import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Card, CardContent } from '../components/ui';
import { useAuthStore } from '../stores/authStore';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
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
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
              required
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
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