import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Logo from '@/assets/images/logo.webp';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state
    setIsLoading(true); // Set loading state

    try {
      await login(email, password);
      setIsLoading(false);
      navigate('/'); // Redirect to the main page after successful login
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  const navigateToSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center">
          <img src={Logo} alt="Hermes Logo" className="w-16 h-16 mb-4" />
          <h1 className="text-3xl font-semibold text-gray-900">
            Welcome to Hermes
          </h1>
          <p className="text-sm text-gray-600">
            Log in to Hermes, your reliable messaging companion.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-600 text-center">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full"
              placeholder="Enter your password"
            />
          </div>
          <div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Logging In...' : 'Login'}
            </Button>
          </div>
        </form>
        <div className="text-sm text-center text-gray-500 mt-4">
          Don't have an account?{' '}
          <button
            onClick={navigateToSignup}
            className="text-blue-600 hover:underline"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
