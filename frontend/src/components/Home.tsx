import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, Home as HomeIcon, Mic, Gamepad2, MessageCircle, User, Crown, Users, TrendingUp } from 'lucide-react';

const mockRooms = [
  { id: 1, name: "Night Music Chill", host: "DJ Shadow", viewers: 1250, tags: ["Music", "Chill"], gradient: "from-purple-500 to-indigo-600" },
  { id: 2, name: "Urdu Poetry Club", host: "Ayesha", viewers: 840, tags: ["Poetry", "Urdu"], gradient: "from-pink-500 to-rose-500" },
  { id: 3, name: "Gossip & Fun", host: "King Khan", viewers: 2300, tags: ["Chat", "Fun"], gradient: "from-blue-500 to-cyan-500" },
  { id: 4, name: "Late Night Stories", host: "Sara", viewers: 450, tags: ["Stories", "English"], gradient: "from-orange-500 to-amber-500" }
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', icon: HomeIcon, label: 'Home', path: '/home' },
    { id: 'rooms', icon: Mic, label: 'Rooms', path: '/rooms' },
    { id: 'games', icon: Gamepad2, label: 'Games', path: '/games' },
    { id: 'messages', icon: MessageCircle, label: 'Messages', path: '/messages' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' }
  ];

  return (
    <div className="pb-20 relative min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-dark-darker/90 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-md">
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-secondary-light">
          ZAKHMI MAHI
        </h1>
        <div className="flex space-x-4">
          <button className="text-gray-300 hover:text-white transition">
            <Search size={24} />
          </button>
          <button className="text-gray-300 hover:text-white transition relative">
            <Bell size={24} />
            <span className="absolute -top-1 -right-1 bg-secondary w-3 h-3 rounded-full border-2 border-dark-darker"></span>
          </button>
        </div>
      </header>

      <main className="p-4 space-y-8">
        {/* Banner/VIP Section */}
        <section>
          <div className="bg-gradient-to-r from-primary-dark to-primary rounded-2xl p-4 flex items-center justify-between shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-lg font-bold text-white mb-1 flex items-center">
                <Crown size={20} className="mr-2 text-yellow-300" /> Premium VIP
              </h2>
              <p className="text-sm text-gray-200">Upgrade to unlock exclusive frames!</p>
            </div>
            <button className="relative z-10 bg-white text-primary-dark px-4 py-2 rounded-full text-sm font-bold shadow-md hover:bg-gray-100 transition">
              Upgrade
            </button>
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
          </div>
        </section>

        {/* Categories / Quick Links */}
        <section className="flex justify-around items-center bg-dark py-4 rounded-xl shadow-inner">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
            <span className="text-xs font-semibold text-gray-300">Trending</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
              <Users className="text-white" size={24} />
            </div>
            <span className="text-xs font-semibold text-gray-300">Families</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg">
              <Mic className="text-white" size={24} />
            </div>
            <span className="text-xs font-semibold text-gray-300">New Rooms</span>
          </div>
        </section>

        {/* Popular Rooms */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Popular Rooms</h3>
            <button className="text-primary-light text-sm font-semibold hover:underline">See All</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {mockRooms.map(room => (
              <div key={room.id} className={`rounded-xl p-4 bg-gradient-to-br ${room.gradient} shadow-lg relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform`}>
                <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-white">{room.viewers}</span>
                </div>
                <div className="mt-6">
                  <h4 className="font-bold text-white truncate text-sm">{room.name}</h4>
                  <p className="text-xs text-white/80 mt-1">Host: {room.host}</p>
                </div>
                <div className="mt-3 flex gap-1">
                  {room.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-dark-darker/95 backdrop-blur-md border-t border-dark-light px-6 py-3 pb-safe">
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
    </div>
  );
};

export default Home;
