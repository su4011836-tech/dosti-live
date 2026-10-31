import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, Mic, Coins, TrendingUp, Settings, AlertTriangle, Activity } from 'lucide-react';

const statCards = [
  { id: 1, label: "Total Users", value: "24.5k", icon: Users, color: "text-blue-500", bg: "bg-blue-500/20" },
  { id: 2, label: "Active Rooms", value: "156", icon: Mic, color: "text-green-500", bg: "bg-green-500/20" },
  { id: 3, label: "Total Revenue", value: "1.2M", icon: Coins, color: "text-yellow-500", bg: "bg-yellow-500/20" },
  { id: 4, label: "Reports", value: "12", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/20" },
];

const Admin: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Sidebar / Top Nav for mobile */}
      <header className="bg-[#1e293b] p-4 flex justify-between items-center border-b border-slate-700 sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="text-red-500" size={24} />
          <h1 className="text-lg font-bold">Admin Panel</h1>
        </div>
        <button onClick={() => navigate('/home')} className="text-sm bg-slate-700 hover:bg-slate-600 px-4 py-1.5 rounded-full transition">
          Exit
        </button>
      </header>

      <main className="p-4 space-y-6">
        {/* Overview Stats */}
        <div>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
            <Activity size={16} className="mr-2" /> Overview
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {statCards.map(stat => (
              <div key={stat.id} className="bg-[#1e293b] p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className={`${stat.bg} p-2 rounded-lg`}>
                    <stat.icon size={20} className={stat.color} />
                  </div>
                  <TrendingUp size={16} className="text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Management</h2>
          <div className="space-y-3">
            <button className="w-full bg-[#1e293b] p-4 rounded-xl border border-slate-800 flex items-center justify-between hover:bg-slate-800 transition group">
              <div className="flex items-center space-x-3">
                <Users className="text-slate-400" size={20} />
                <span className="font-semibold text-sm">User Management</span>
              </div>
              <span className="text-slate-500 group-hover:text-white transition">›</span>
            </button>
            <button className="w-full bg-[#1e293b] p-4 rounded-xl border border-slate-800 flex items-center justify-between hover:bg-slate-800 transition group">
              <div className="flex items-center space-x-3">
                <Mic className="text-slate-400" size={20} />
                <span className="font-semibold text-sm">Room Moderation</span>
              </div>
              <span className="text-slate-500 group-hover:text-white transition">›</span>
            </button>
            <button className="w-full bg-[#1e293b] p-4 rounded-xl border border-slate-800 flex items-center justify-between hover:bg-slate-800 transition group">
              <div className="flex items-center space-x-3">
                <Coins className="text-slate-400" size={20} />
                <span className="font-semibold text-sm">Economy Settings</span>
              </div>
              <span className="text-slate-500 group-hover:text-white transition">›</span>
            </button>
            <button className="w-full bg-[#1e293b] p-4 rounded-xl border border-slate-800 flex items-center justify-between hover:bg-slate-800 transition group">
              <div className="flex items-center space-x-3">
                <Settings className="text-slate-400" size={20} />
                <span className="font-semibold text-sm">Platform Settings</span>
              </div>
              <span className="text-slate-500 group-hover:text-white transition">›</span>
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Admin;
