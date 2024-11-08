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
        
        {/* <div className='page-down absolute bottom-44 flex items-center mt-6 px-4 border border-gray-600 py-3 rounded-lg bg-white'>
          <div className="px-1 py-0.5 border border-gray-600 text-white rounded-xl mr-2 bg-blue-700">
            new
          </div>
          <span className="text-gray-600">Meet Claude 3.5 Sonnet, our latest model. Hope so that you will enjoy using it.</span>
        </div>

        <div className='page-down text-center absolute bottom-24 text-2xl font-stratford'>
          Claude is a next generation AI assistant built for work <br></br>
          and trained to be safe, accurate and secure.
        </div>

        <div className='page-down absolute bottom-12 font-mono'>
          By Arsh
        </div> */}
      </div>
    </div>
  );
};

export default landing;
