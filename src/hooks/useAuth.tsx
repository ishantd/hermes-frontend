import { useState } from 'react';
import { Request } from '@/networking';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const response = await Request('POST', '/auth/login', {
        email,
        password,
      });
      setUser(response.data);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
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
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const whoami = async () => {
    try {
      const response = await Request('GET', '/auth/whoami');
      setUser(response.data);
    } catch (error) {
      console.error('Whoami failed:', error);
      // call logout if whoami fails
      logout();
    }
  };

  const logout = async () => {
    try {
      await Request('POST', '/auth/logout');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { user, login, signup, logout, whoami };
};
