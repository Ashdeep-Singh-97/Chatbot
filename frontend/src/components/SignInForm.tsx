import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import ErrorCard from './ErrorCard';

interface SignInFormProps {
  toggleForm: () => void;
  navigateToHome: (email: string) => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ toggleForm, navigateToHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleToggleForm = () => {
    toggleForm();
  };
  // Custom function to handle both actions
  const handleCustomAction = async () => {
    try {
      const response = await axios.post('https://chatbot-sigma-ashy.vercel.app/api/v1/signin',
        { email, password },
        {
          withCredentials: true,
          // Allow 204 No Content as a valid status
          validateStatus: function (status) {
            // Accept status codes 2xx and 204 as valid
            return status >= 200 && status < 300 || status === 204;
          }
        });
      const token = response.data.token;
      // stat = response.status;
      console.log(response.status);
      if (response.status === 200) {
        Cookies.set('token', `Bearer ${token}`);
        console.log('Sign in successful');
        navigateToHome(email);
      } else if (response.status === 204) {
        setError('Signin attempt did not provide any content. Try again.');
        console.log("Response 204");
      }else {
        setError('Sign in failed. Please try again.');
      }
    } catch (error : any) {
      setError('An error occurred. Please try again later.');
      console.log("Error Is : ", error);
    }
  };

  return (
    <div>
      {error && <ErrorCard message={error} onClose={() => setError(null)} />}
      <h2 className="text-2xl font-bold mb-6">Sign In</h2>
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
        <button
          onClick={handleCustomAction} // Call handleClick when the button is clicked
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Sign In
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Don’t have an account?{' '}
        <button
          onClick={handleToggleForm}
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default SignInForm;
