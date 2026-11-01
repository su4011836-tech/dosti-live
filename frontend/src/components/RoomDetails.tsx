import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Mic, MicOff, Users, Settings, LogOut, MessageSquare, Gift, Plus } from 'lucide-react';
import { LiveKitRoom, RoomAudioRenderer, useParticipants } from '@livekit/components-react';
import '@livekit/components-styles';
import api from '../api/client';

interface RoomData {
  id: string;
  name: string;
  isVIP: boolean;
  host: {
    username: string;
  };
  viewers: number;
  tags: string[];
}

const mockChat = [
  { id: 1, user: "Ali", text: "Hello everyone!", color: "text-blue-400" },
  { id: 2, user: "Ayesha", text: "Hi Ali, welcome to the room.", color: "text-pink-400" },
  { id: 3, user: "System", text: "King Khan sent a Rose! 🌹", color: "text-yellow-400", isSystem: true }
];

const RoomDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<RoomData | null>(null);
  const [liveKitToken, setLiveKitToken] = useState<string | null>(null);
  const [liveKitUrl, setLiveKitUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndJoinRoom = async () => {
      try {
        if (!id) return;
        const res = await api.get(`/rooms/${id}`);
        setRoom(res.data);

        // Join backend & get LiveKit token
        const joinRes = await api.post(`/rooms/${id}/join`);
        if (joinRes.data.liveKitToken && joinRes.data.liveKitUrl) {
            setLiveKitToken(joinRes.data.liveKitToken);
            setLiveKitUrl(joinRes.data.liveKitUrl);
        } else {
            // For environments without LiveKit keys, we'll keep variables null to show the placeholder warning.
        }
      } catch (err) {
        console.error("Failed to load room details");
      } finally {
        setLoading(false);
      }
    };
    fetchAndJoinRoom();

    return () => {
      if (id) {
         api.post(`/rooms/${id}/leave`).catch(() => {});
      }
    };
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-dark flex items-center justify-center text-white">Loading room...</div>;
  }

  if (!room) {
    return <div className="min-h-screen bg-dark flex items-center justify-center text-white">Room not found.</div>;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-blue-600 to-indigo-800 flex flex-col relative`}>
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
              <p className="text-[10px] text-gray-300">Host: {room.host.username}</p>
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

        {/* LiveKit Integrated Area */}
        <div className="px-6 mb-auto flex-1">
            {liveKitToken && liveKitUrl ? (
                <LiveKitRoom
                    token={liveKitToken}
                    serverUrl={liveKitUrl}
                    connect={true}
                    className="h-full flex flex-col"
                >
                    <LiveKitParticipantsGrid />
                    <RoomAudioRenderer />
                </LiveKitRoom>
            ) : (
                <div className="bg-black/30 rounded-2xl p-6 text-center border border-white/10 mt-10">
                    <Settings size={32} className="mx-auto text-yellow-500 mb-3" />
                    <h3 className="font-bold text-white mb-2">LiveKit Config Required</h3>
                    <p className="text-xs text-gray-400">Audio features are currently disabled. Please add LIVEKIT_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET to the backend environment variables.</p>
                </div>
            )}
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


// Sub-component to render LiveKit participants
const LiveKitParticipantsGrid: React.FC = () => {
    const participants = useParticipants();

    // Fill remaining spots with empty seats up to 8
    const seats = Array.from({ length: 8 }).map((_, i) => participants[i] || null);

    return (
        <div className="grid grid-cols-4 gap-y-6 gap-x-4 mt-6">
            {seats.map((p, idx) => (
                <div key={p ? p.identity : `empty-${idx}`} className="flex flex-col items-center">
                    <div className={`relative w-14 h-14 rounded-full flex items-center justify-center ${p ? 'bg-primary' : 'bg-black/20 border border-white/10'} shadow-lg cursor-pointer hover:scale-105 transition overflow-hidden`}>
                        {p ? (
                            <span className="text-xl font-bold text-white uppercase">{p.name?.charAt(0) || 'U'}</span>
                        ) : (
                            <Plus size={20} className="text-white/30" />
                        )}

                        {p && !p.isSpeaking && !p.isMicrophoneEnabled && (
                            <div className="absolute -top-1 -right-1 bg-dark rounded-full p-0.5">
                                <MicOff size={12} className="text-red-400" />
                            </div>
                        )}
                        {p && p.isSpeaking && (
                             <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-pulse"></div>
                        )}
                    </div>
                    <span className="text-[10px] text-white mt-2 truncate w-16 text-center">
                        {p ? p.name : `Seat ${idx + 1}`}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default RoomDetails;
