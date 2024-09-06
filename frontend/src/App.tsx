import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import HomePage from './pages/home'; // Ensure you have this component

const FormWrapper: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();

  const navigateToHome = (email: string) => {
    navigate('/home', { state: { user: { email } } });
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        {isSignIn ? (
          <SignInForm 
            toggleForm={() => setIsSignIn(false)} 
            navigateToHome={(email) => navigateToHome(email)}
          />
        ) : (
          <SignUpForm 
            toggleForm={() => setIsSignIn(true)} 
            navigateToHome={(email) => navigateToHome(email)}
          />
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormWrapper />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
