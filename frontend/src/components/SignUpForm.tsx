// src/components/SignUpForm.tsx

import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import ErrorCard from './ErrorCard';

interface SignUpFormProps {
  toggleForm: () => void;
  navigateToHome: (email: string) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ toggleForm, navigateToHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleToggleForm = () => {
    toggleForm();
  };

  const handleCustomAction = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const response = await axios.post('https://chatbot-sigma-ashy.vercel.app/api/v1/signup', { email, password });
      const token = response.data.token;
      if (response.status === 200) {
        Cookies.set('token', `Bearer ${token}`);
        console.log('Sign up successful');
        navigateToHome(email);
      } else {
        setError('Sign up failed. Please try again.');
      }
    } catch (error) {
      // Check if error is an Axios error
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
        setError('An error occurred. Please try again later.');
      } else {
        console.error('Unexpected error:', error);
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div>
      {error && <ErrorCard message={error} onClose={() => setError(null)} />}
      <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <button
          onClick={handleCustomAction} // Call handleClick when the button is clicked
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Have an account?{' '}
        <button
          onClick={handleToggleForm}
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

export default SignUpForm;
