import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic2, Mail, Lock, ChevronLeft } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-dark-darker flex flex-col p-6">
      <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white mt-4 w-fit">
        <ChevronLeft size={28} />
      </button>

      <div className="flex flex-col items-center justify-center mt-12 mb-10">
        <div className="bg-gradient-to-r from-primary-light to-secondary-light p-4 rounded-full shadow-lg mb-4">
          <Mic2 size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-secondary-light tracking-wide">
          Welcome Back
        </h1>
        <p className="text-gray-400 mt-2">Login to your Zakhmi Mahi account</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6 flex-1">
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email or Username"
              required
              className="w-full bg-dark text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-gray-800"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full bg-dark text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-gray-800"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <a href="#" className="text-sm text-primary-light font-semibold hover:underline">Forgot Password?</a>
        </div>

        <button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary py-3.5 rounded-xl font-bold text-white shadow-lg shadow-primary/30 hover:opacity-90 transition">
          Login
        </button>
      </form>

      <div className="mt-8 text-center pb-8">
        <p className="text-gray-400 text-sm">
          Don't have an account?{' '}
          <button onClick={() => navigate('/register')} className="text-primary-light font-bold hover:underline">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
