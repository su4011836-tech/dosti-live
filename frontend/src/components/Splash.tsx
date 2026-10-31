import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic2 } from 'lucide-react';

const Splash: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary-dark via-dark-darker to-dark-darker">
      <div className="animate-bounce mb-6 bg-gradient-to-r from-primary-light to-secondary-light p-6 rounded-full shadow-lg shadow-primary/30">
        <Mic2 size={64} className="text-white" />
      </div>
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-secondary-light mb-2 tracking-wider">
        ZAKHMI MAHI
      </h1>
      <p className="text-gray-400 text-sm tracking-widest uppercase font-semibold">
        Voice • Friends • Games • Fun
      </p>

      <div className="absolute bottom-10 flex space-x-2">
        <div className="w-2 h-2 rounded-full bg-primary-light animate-ping"></div>
        <div className="w-2 h-2 rounded-full bg-secondary-light animate-ping" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 rounded-full bg-primary animate-ping" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default Splash;
