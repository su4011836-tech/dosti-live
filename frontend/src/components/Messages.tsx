import React, { useState } from 'react';
import { Search, UserPlus, MoreVertical, MessageCircle, Users } from 'lucide-react';

const mockChats = [
  { id: 1, name: "Ayesha", msg: "Hey, are you joining the room today?", time: "10:30 AM", unread: 2, online: true, avatar: "bg-pink-500" },
  { id: 2, name: "Rahul", msg: "Let's play Ludo!", time: "Yesterday", unread: 0, online: false, avatar: "bg-blue-500" },
  { id: 3, name: "DJ Shadow", msg: "Thanks for the gift bro", time: "Yesterday", unread: 0, online: true, avatar: "bg-purple-500" },
  { id: 4, name: "Zara", msg: "Sent you a request", time: "Monday", unread: 1, online: false, avatar: "bg-rose-500" },
  { id: 5, name: "System", msg: "You reached VIP Level 2!", time: "Sunday", unread: 0, online: true, avatar: "bg-yellow-500" }
];

const mockRequests = [
  { id: 1, name: "Imran", mutual: 4, avatar: "bg-teal-500" },
  { id: 2, name: "Sara", mutual: 12, avatar: "bg-orange-500" }
];

const Messages: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chats' | 'friends'>('chats');

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
          {mockChats.map(chat => (
            <div key={chat.id} className="flex items-center space-x-4 p-3 rounded-2xl bg-dark hover:bg-dark-light transition cursor-pointer group">
              <div className="relative">
                <div className={`w-14 h-14 rounded-full ${chat.avatar} flex items-center justify-center text-xl font-bold text-white shadow-md`}>
                  {chat.name.charAt(0)}
                </div>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-dark rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-white truncate">{chat.name}</h3>
                  <span className={`text-[10px] ${chat.unread > 0 ? 'text-primary-light font-bold' : 'text-gray-500'}`}>{chat.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className={`text-sm truncate ${chat.unread > 0 ? 'text-gray-200 font-semibold' : 'text-gray-500'}`}>
                    {chat.msg}
                  </p>
                  {chat.unread > 0 && (
                    <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-2">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
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