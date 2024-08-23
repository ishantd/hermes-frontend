import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Logo from '@/assets/images/logo.webp';

const SignupForm: React.FC = () => {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state
    setIsLoading(true); // Set loading state

    try {
      await signup(email, name, password);
      setIsLoading(false);
      navigate('/'); // Redirect to the main page after successful signup
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center">
          <img src={Logo} alt="Hermes Logo" className="w-16 h-16 mb-4" />
          <h1 className="text-3xl font-semibold text-gray-900">
            Create Your Hermes Account
          </h1>
          <p className="text-sm text-gray-600">
            Join Hermes and start your journey of evaluating this assignment.
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
              Name
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full"
              placeholder="Enter your name"
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
              placeholder="Create a password"
            />
          </div>
          <div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </div>
        </form>
        <div className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{' '}
          <button
            onClick={navigateToLogin}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
