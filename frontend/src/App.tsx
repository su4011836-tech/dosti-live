import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Mic, Gamepad2, MessageCircle, User } from 'lucide-react';
import Splash from './components/Splash';
import Home from './components/Home';
import Rooms from './components/Rooms';
import { AuthProvider } from './context/AuthContext';
import Games from './components/Games';
import Messages from './components/Messages';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import RoomDetails from './components/RoomDetails';
import Wallet from './components/Wallet';
import Recharge from './components/Recharge';
import Admin from './components/Admin';

function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="min-h-screen bg-dark-darker text-white font-sans">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/games" element={<Games />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />

          {/* Sub-pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/room/:id" element={<RoomDetails />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/recharge" element={<Recharge />} />

          {/* Admin */}
          <Route path="/admin" element={<Admin />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Routes>
          <Route path="/" element={null} />
          <Route path="/login" element={null} />
          <Route path="/register" element={null} />
          <Route path="/room/:id" element={null} />
          <Route path="/recharge" element={null} />
          <Route path="/admin" element={null} />
          <Route path="*" element={<BottomNav />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', icon: HomeIcon, label: 'Home', path: '/home' },
    { id: 'rooms', icon: Mic, label: 'Rooms', path: '/rooms' },
    { id: 'games', icon: Gamepad2, label: 'Games', path: '/games' },
    { id: 'messages', icon: MessageCircle, label: 'Messages', path: '/messages' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' }
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-dark-darker/95 backdrop-blur-md border-t border-dark-light px-6 py-3 pb-safe z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map(item => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary-light' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <div className={`p-2 rounded-full ${isActive ? 'bg-primary/20' : ''}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  );
}

export default App;
