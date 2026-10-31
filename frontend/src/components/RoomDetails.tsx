import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Mic, MicOff, Users, Settings, LogOut, MessageSquare, Gift, Plus } from 'lucide-react';

const mockRoom = {
  id: "1",
  name: "Desi Boyz Lounge",
  host: "Rahul",
  viewers: 1850,
  tags: ["Chat", "Desi"],
  gradient: "from-blue-600 to-indigo-800"
};

const mockSeats = [
  { id: 1, user: "Rahul", isHost: true, isMuted: false, avatar: "bg-red-500" },
  { id: 2, user: "Ayesha", isHost: false, isMuted: true, avatar: "bg-pink-500" },
  { id: 3, user: "Zara", isHost: false, isMuted: false, avatar: "bg-purple-500" },
  { id: 4, user: null, isHost: false, isMuted: false, avatar: "" }, // empty seat
  { id: 5, user: null, isHost: false, isMuted: false, avatar: "" },
  { id: 6, user: null, isHost: false, isMuted: false, avatar: "" },
  { id: 7, user: null, isHost: false, isMuted: false, avatar: "" },
  { id: 8, user: null, isHost: false, isMuted: false, avatar: "" },
];

const mockChat = [
  { id: 1, user: "Ali", text: "Hello everyone!", color: "text-blue-400" },
  { id: 2, user: "Ayesha", text: "Hi Ali, welcome to the room.", color: "text-pink-400" },
  { id: 3, user: "System", text: "King Khan sent a Rose! 🌹", color: "text-yellow-400", isSystem: true }
];

const RoomDetails: React.FC = () => {
  const navigate = useNavigate();
  useParams(); // Just reading to avoid unused var in mock

  // In a real app, fetch room details based on `id`
  const room = mockRoom;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${room.gradient} flex flex-col relative`}>
      {/* Background Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="px-4 py-4 flex justify-between items-start">
          <div className="flex items-center space-x-3 bg-black/30 backdrop-blur-md rounded-full p-1 pr-4">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold border-2 border-primary-light">
              R
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">{room.name}</h1>
              <p className="text-[10px] text-gray-300">Host: {room.host}</p>
            </div>
            <button className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-full text-[10px] font-bold ml-2">
              Follow
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-black/30 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center space-x-1.5">
              <Users size={14} className="text-white" />
              <span className="text-xs font-bold text-white">{room.viewers}</span>
            </div>
            <button onClick={() => navigate('/rooms')} className="bg-black/30 hover:bg-black/50 backdrop-blur-md p-2 rounded-full text-white transition">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Room Info & Tags */}
        <div className="px-4 flex items-center space-x-2 mb-6">
          <div className="bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] text-white flex items-center">
             ID: 100456
          </div>
          {room.tags.map(tag => (
            <span key={tag} className="text-[10px] bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full text-white">
              {tag}
            </span>
          ))}
        </div>

        {/* Seats Grid */}
        <div className="px-6 mb-auto">
          <div className="grid grid-cols-4 gap-y-6 gap-x-4">
            {mockSeats.map(seat => (
              <div key={seat.id} className="flex flex-col items-center">
                <div className={`relative w-14 h-14 rounded-full flex items-center justify-center ${seat.user ? seat.avatar : 'bg-black/20 border border-white/10'} shadow-lg cursor-pointer hover:scale-105 transition`}>
                  {seat.user ? (
                    <span className="text-xl font-bold text-white">{seat.user.charAt(0)}</span>
                  ) : (
                    <Plus size={20} className="text-white/30" />
                  )}

                  {seat.isHost && (
                    <div className="absolute -bottom-2 bg-yellow-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-dark">
                      Host
                    </div>
                  )}
                  {seat.isMuted && seat.user && (
                    <div className="absolute -top-1 -right-1 bg-dark rounded-full p-0.5">
                      <MicOff size={12} className="text-red-400" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-white mt-2 truncate w-16 text-center">
                  {seat.user || `Seat ${seat.id}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="px-4 flex-1 overflow-y-auto mb-4 mt-4 space-y-3 scrollbar-hide flex flex-col justify-end">
          {mockChat.map(msg => (
            <div key={msg.id} className={`text-sm ${msg.isSystem ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-black/20'} backdrop-blur-md px-3 py-2 rounded-xl inline-block max-w-[85%]`}>
              {!msg.isSystem && <span className={`${msg.color} font-bold mr-2`}>{msg.user}:</span>}
              <span className={msg.isSystem ? msg.color : 'text-white/90'}>{msg.text}</span>
            </div>
          ))}
        </div>

        {/* Bottom Controls */}
        <div className="px-4 py-3 bg-black/30 backdrop-blur-lg flex items-center justify-between pb-safe">
          <div className="flex items-center space-x-3 w-full">
            <button className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full text-white transition">
              <MessageSquare size={20} />
            </button>
            <button className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full text-white transition">
              <Mic size={20} />
            </button>
            <button className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full text-white transition">
              <Settings size={20} />
            </button>
            <div className="flex-1"></div>
            <button className="bg-gradient-to-r from-pink-500 to-rose-500 p-2.5 rounded-full text-white shadow-lg shadow-pink-500/30 hover:scale-110 transition flex items-center space-x-1 px-4">
              <Gift size={20} />
              <span className="font-bold text-sm">Gift</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
