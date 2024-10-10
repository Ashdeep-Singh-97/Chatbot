// src/BouncingBall.tsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

const BouncingBall: React.FC = () => {
    const ballRef = useRef<HTMLImageElement | null>(null);
    const navigate = useNavigate(); // Use useNavigate for navigation

    useEffect(() => {
        const tl = gsap.timeline();

        tl.to(ballRef.current, { y: -100, duration: 0.5, yoyo: true, repeat: 1 })
          .to(ballRef.current, { y: -100, duration: 0.5 }) // Third bounce
          .to(ballRef.current, {
            scale: 30, 
            opacity:100,
            duration: 3,
            ease: "power1.out", // Simulating a splash effect
            onComplete: () => {
                navigate('/landing'); // Navigate to new page after the splash
            }
        });
    }, [navigate]);

    return (
        <div>
            <div
                ref={ballRef}
                style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: '50%',
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#ebe8de', // Fill color as requested
                    borderRadius: '50%', // Make it circular
                }}
            />
        </div>
    );
};

export default BouncingBall;
