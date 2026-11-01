import React, { useEffect, useState } from 'react';
import { Search, UserPlus, MoreVertical, MessageCircle, Users } from 'lucide-react';
import api from '../api/client';

interface Conversation {
  user: {
    id: string;
    username: string;
    isVIP: boolean;
  };
  lastMessage: string;
  timestamp: string;
  unread: number;
}

const mockRequests = [
  { id: 1, name: "Imran", mutual: 4, avatar: "bg-teal-500" },
  { id: 2, name: "Sara", mutual: 12, avatar: "bg-orange-500" }
];

const Messages: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chats' | 'friends'>('chats');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/messages/conversations');
        setConversations(res.data);
      } catch (error) {
        console.error("Failed to load conversations", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  return (
    <div className="pb-24 pt-4 px-4 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <div className="flex space-x-3">
          <button className="text-gray-300 hover:text-white transition">
            <UserPlus size={24} />
          </button>
          <button className="text-gray-300 hover:text-white transition">
            <MoreVertical size={24} />
          </button>
        </div>
      </div>

      <div className="flex bg-dark-light rounded-xl p-1 mb-6">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-semibold transition ${activeTab === 'chats' ? 'bg-primary text-white shadow' : 'text-gray-400 hover:text-white'}`}
        >
          <MessageCircle size={18} /> <span>Chats</span>
        </button>
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-semibold transition relative ${activeTab === 'friends' ? 'bg-primary text-white shadow' : 'text-gray-400 hover:text-white'}`}
        >
          <Users size={18} /> <span>Friends</span>
          <span className="absolute top-2 right-6 w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
        </button>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder={activeTab === 'chats' ? "Search messages..." : "Search friends..."}
          className="w-full bg-dark text-white rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
        />
        <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
      </div>

      {activeTab === 'chats' ? (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-gray-500 py-4">Loading messages...</div>
          ) : conversations.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No messages yet.</div>
          ) : (
            conversations.map(chat => (
              <div key={chat.user.id} className="flex items-center space-x-4 p-3 rounded-2xl bg-dark hover:bg-dark-light transition cursor-pointer group">
                <div className="relative">
                  <div className={`w-14 h-14 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-white shadow-md`}>
                    {chat.user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-gray-500 border-2 border-dark rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-white truncate">{chat.user.username}</h3>
                    <span className={`text-[10px] ${chat.unread > 0 ? 'text-primary-light font-bold' : 'text-gray-500'}`}>
                      {new Date(chat.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-sm truncate ${chat.unread > 0 ? 'text-gray-200 font-semibold' : 'text-gray-500'}`}>
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-2">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-4 px-2">Friend Requests (2)</h3>
            <div className="space-y-3">
              {mockRequests.map(req => (
                <div key={req.id} className="flex items-center space-x-3 p-3 rounded-2xl bg-dark shadow-sm">
                  <div className={`w-12 h-12 rounded-full ${req.avatar} flex items-center justify-center font-bold text-white`}>
                    {req.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{req.name}</h4>
                    <p className="text-xs text-gray-500">{req.mutual} mutual friends</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded-full text-xs font-bold transition">
                      Accept
                    </button>
                    <button className="bg-dark-light hover:bg-gray-700 text-white px-4 py-1.5 rounded-full text-xs font-bold transition">
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;