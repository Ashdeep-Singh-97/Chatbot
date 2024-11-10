import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from "gsap";
import SignInForm from '../components/SignInForm';
import SignUpForm from '../components/SignUpForm';
import Navbar from '../components/Navbar';

const landing: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();

  const navigateToHome = (email: string) => {
    navigate('/home', { state: { user: { email } } });
  };

  useEffect(() => {
        gsap.fromTo(".page-top",
            { opacity: 0, delay: 1, duration : 2, y : 50 },
            {opacity: 100, y : 0}
        );
        gsap.fromTo(".page-down",
          { opacity: 0, delay: 1, duration : 2, y : -50 },
          {opacity: 100, y : 0}
      
      );
      }, []);

  return (
    <div style={{ backgroundColor: '#ebe8e0' }}>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen" >

        <div className='mt-10 text-center page-top'>
          <div className='text-6xl font-stratford font-light mb-6'>
            Generate Code
          </div>
          <div className='text-6xl font-stratford font-light mb-12'>
            With <span className="font-semibold">Claude</span>
          </div>
          <div className='font-stratford font-light mb-12'>
            (email: bote@gmail.com | password: 123)
          </div>
        </div>

        <div style={{ backgroundColor: 'rgb(223, 219, 205)' }} className="w-full max-w-md p-5 shadow-2xl rounded-lg component opacity-100">
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
    </div>
  );
};

export default landing;
