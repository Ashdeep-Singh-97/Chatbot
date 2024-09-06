// HomePage.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const HomePage: React.FC = () => {
  const location = useLocation();
  const user = location.state?.user || { email: 'Guest' }; // Provide a default value

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome, {user.email}!</h1>
      {/* Add more content for the home page here */}
    </div>
  );
};

export default HomePage;
