import React, { useEffect, useState } from 'react';

interface ErrorCardProps {
  message: string;
  onClose: () => void;
}

const ErrorCard: React.FC<ErrorCardProps> = ({ message, onClose }) => {
  const [showCard, setShowCard] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCard(false);
      onClose(); // Optionally, call onClose() to trigger any additional cleanup
    }, 2500); // Duration of the progress bar

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 transition-opacity duration-300 ${showCard ? 'opacity-100' : 'opacity-0'}`}>
      <div className="relative bg-red-600 text-white p-4 rounded-md shadow-lg">
        {/* Progress bar */}
        <div className={`absolute top-0 left-0 w-full h-2 bg-pink-300 ${showCard ? 'animate-progress-bar' : ''} transition-all duration-500`}></div>
        <p className="relative z-10">{message}</p> {/* Ensures text appears above the progress bar */}
      </div>
    </div>
  );
};

export default ErrorCard;
