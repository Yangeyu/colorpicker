import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  destination?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  destination = '/',
  className = ''
}) => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(destination)}
      className={`flex items-center px-4 py-2 rounded-full bg-gray-900 text-purple-400 border border-purple-500 hover:bg-purple-900/30 transition-all tech-font cursor-pointer ${className}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back
    </button>
  );
};

export default BackButton; 