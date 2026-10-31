import React from 'react';
import { Mic, Search, Shield, Plus, Crown } from 'lucide-react';

const mockCategories = ["All", "Music", "Chat", "Dating", "Games", "Poetry"];

const mockRooms = [
  { id: 1, name: "Desi Boyz Lounge", host: "Rahul", viewers: 1850, tags: ["Chat", "Desi"], isVIP: true, gradient: "from-blue-600 to-indigo-800" },
  { id: 2, name: "Late Night Music 🎵", host: "DJ Shadow", viewers: 3200, tags: ["Music", "Vibes"], isVIP: false, gradient: "from-purple-600 to-pink-600" },
  { id: 3, name: "Urdu Poetry Club", host: "Ayesha", viewers: 840, tags: ["Poetry", "Urdu"], isVIP: false, gradient: "from-rose-500 to-red-700" },
  { id: 4, name: "Gossip & Fun", host: "King Khan", viewers: 2300, tags: ["Chat", "Fun"], isVIP: true, gradient: "from-teal-500 to-emerald-700" },
  { id: 5, name: "Ludo Champions", host: "Winner", viewers: 150, tags: ["Games", "Ludo"], isVIP: false, gradient: "from-orange-500 to-amber-700" },
  { id: 6, name: "Sad Songs 💔", host: "BrokenHeart", viewers: 920, tags: ["Music", "Sad"], isVIP: false, gradient: "from-slate-700 to-zinc-900" }
];

const Rooms: React.FC = () => {
  return (
    <div className="pb-24 pt-4 px-4 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Voice Rooms</h1>
        <button className="bg-primary hover:bg-primary-dark text-white p-2 rounded-full shadow-lg transition">
          <Plus size={24} />
        </button>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search rooms, users, or tags..."
          className="w-full bg-dark-light text-white rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
        />
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
      </div>

      <div className="flex space-x-3 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {mockCategories.map((cat, index) => (
          <button
            key={cat}
            className={`whitespace-nowrap px-5 py-2 rounded-full font-semibold text-sm transition ${index === 0 ? 'bg-primary text-white shadow-md' : 'bg-dark text-gray-300 hover:bg-dark-light'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {mockRooms.map(room => (
          <div key={room.id} className={`rounded-2xl p-4 bg-gradient-to-br ${room.gradient} shadow-lg relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform`}>

            <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-[11px] font-bold text-white">{room.viewers}</span>
            </div>

            {room.isVIP && (
              <div className="absolute top-2 left-2 bg-yellow-400/90 rounded-full p-1 shadow-sm">
                <Crown size={12} className="text-black" />
              </div>
            )}

            <div className="mt-8">
              <h3 className="font-bold text-white leading-tight mb-1">{room.name}</h3>
              <p className="text-xs text-white/80 flex items-center">
                <Shield size={12} className="mr-1 opacity-70" /> {room.host}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {room.tags.map(tag => (
                <span key={tag} className="text-[10px] bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-white font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-24 right-6">
        <button className="w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform focus:outline-none">
          <Mic size={28} />
        </button>
      </div>
    </div>
  );
};

export default Rooms;