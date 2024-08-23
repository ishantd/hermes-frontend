import { useState } from 'react';
import { Request } from '@/networking';
import { useNavigate } from 'react-router-dom';

type User = {
  id: string;
  email: string;
  name: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const response = await Request('POST', '/auth/login', {
        email,
        password,
      });
      setUser(response.data);
      navigate('/');
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.detail) {
        throw new Error(error.detail);
      } else {
        throw new Error('An error occurred during signup.');
      }
    }
  };

  const signup = async (email: string, name: string, password: string) => {
    try {
      const response = await Request('POST', '/auth/signup', {
        email,
        name,
        password,
      });
      setUser(response.data);
      navigate('/');
    } catch (error: any) {
      console.error('Signup failed:', error);
      if (error.detail) {
        throw new Error(error.detail);
      } else {
        throw new Error('An error occurred during signup.');
      }
    }
  };

  const whoami = async () => {
    try {
      const response = await Request('GET', '/auth/whoami');
      setUser(response.data);
    } catch (error: any) {
      console.error('Whoami failed:', error);
      logout(); // Call logout if whoami fails
      throw new Error('Failed to verify user session. Please log in again.');
    }
  };

  const logout = async () => {
    try {
      await Request('POST', '/auth/logout');
      setUser(null);
      navigate('/login');
    } catch (error: any) {
      console.error('Logout failed:', error);
      throw new Error('An error occurred during logout.');
    }
  };

  return { user, login, signup, logout, whoami };
};
