import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, Mic, Coins, TrendingUp, Settings, AlertTriangle, Activity, CheckCircle, XCircle } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

interface AdminStats {
  totalUsers: number;
  activeRooms: number;
  totalRevenue: number;
  reportsCount: number;
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState<'overview' | 'payments' | 'settings'>('overview');
  const [paymentRequests, setPaymentRequests] = useState<any[]>([]);
  const [appSettings, setAppSettings] = useState<any>({
      jazzcash_name: '', jazzcash_number: '', jazzcash_enabled: 'false',
      easypaisa_name: '', easypaisa_number: '', easypaisa_enabled: 'false'
  });

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
        setError('Access Denied. You do not have admin privileges.');
        return;
    }

    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load stats');
      }
    };
    const fetchPayments = async () => {
        try {
            const res = await api.get('/admin/payments');
            setPaymentRequests(res.data);
        } catch (e) {
            console.error(e);
        }
    }

    const fetchSettings = async () => {
        try {
            const res = await api.get('/admin/settings');
            setAppSettings(res.data);
        } catch (e) {
            console.error(e);
        }
    }

    if (user?.role === 'ADMIN') {
        fetchStats();
        fetchPayments();
        fetchSettings();
    }
  }, [user]);

  const handleProcessPayment = async (id: string, status: string) => {
      try {
          await api.post(`/admin/payments/${id}/process`, { status, adminNote: "Processed by admin" });
          setPaymentRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
      } catch (err) {
          alert('Failed to process payment');
      }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await api.post('/admin/settings', appSettings);
          alert('Settings saved successfully');
      } catch (err) {
          alert('Failed to save settings');
      }
  };

  if (error) {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6">
            <ShieldAlert size={64} className="text-red-500 mb-4" />
            <h1 className="text-xl font-bold text-center mb-4">{error}</h1>
            <button onClick={() => navigate('/home')} className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-full transition">
              Return Home
            </button>
        </div>
    );
  }

  const statCards = stats ? [
    { id: 1, label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "text-blue-500", bg: "bg-blue-500/20" },
    { id: 2, label: "Active Rooms", value: stats.activeRooms.toLocaleString(), icon: Mic, color: "text-green-500", bg: "bg-green-500/20" },
    { id: 3, label: "Total Revenue", value: stats.totalRevenue.toLocaleString(), icon: Coins, color: "text-yellow-500", bg: "bg-yellow-500/20" },
    { id: 4, label: "Reports", value: stats.reportsCount.toString(), icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/20" },
  ] : [];


  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Sidebar / Top Nav for mobile */}
      <header className="bg-[#1e293b] p-4 flex justify-between items-center border-b border-slate-700 sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="text-red-500" size={24} />
          <h1 className="text-lg font-bold">Admin Panel</h1>
        </div>
        <div className="flex space-x-2">
            <button onClick={() => setActiveView('overview')} className={`text-xs px-3 py-1.5 rounded-full transition ${activeView === 'overview' ? 'bg-primary text-white' : 'bg-slate-700 text-gray-300'}`}>Overview</button>
            <button onClick={() => setActiveView('payments')} className={`text-xs px-3 py-1.5 rounded-full transition ${activeView === 'payments' ? 'bg-primary text-white' : 'bg-slate-700 text-gray-300'}`}>Payments</button>
            <button onClick={() => setActiveView('settings')} className={`text-xs px-3 py-1.5 rounded-full transition ${activeView === 'settings' ? 'bg-primary text-white' : 'bg-slate-700 text-gray-300'}`}>Settings</button>
            <button onClick={() => navigate('/home')} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full transition border border-slate-600">
              Exit
            </button>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {activeView === 'overview' && (
        <>
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
            <button onClick={() => setActiveView('payments')} className="w-full bg-[#1e293b] p-4 rounded-xl border border-slate-800 flex items-center justify-between hover:bg-slate-800 transition group">
              <div className="flex items-center space-x-3">
                <Coins className="text-slate-400" size={20} />
                <span className="font-semibold text-sm">Manual Payments</span>
              </div>
              <span className="text-slate-500 group-hover:text-white transition">›</span>
            </button>
            <button onClick={() => setActiveView('settings')} className="w-full bg-[#1e293b] p-4 rounded-xl border border-slate-800 flex items-center justify-between hover:bg-slate-800 transition group">
              <div className="flex items-center space-x-3">
                <Settings className="text-slate-400" size={20} />
                <span className="font-semibold text-sm">Payment Settings</span>
              </div>
              <span className="text-slate-500 group-hover:text-white transition">›</span>
            </button>
          </div>
        </div>
        </>
        )}

        {activeView === 'payments' && (
          <div>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
                Manual Payment Requests
              </h2>
              <div className="space-y-4">
                  {paymentRequests.length === 0 && <p className="text-slate-500 text-sm">No pending requests.</p>}
                  {paymentRequests.map(req => (
                      <div key={req.id} className="bg-[#1e293b] rounded-xl border border-slate-700 p-4">
                          <div className="flex justify-between items-start mb-3">
                              <div>
                                  <h3 className="font-bold">{req.user.username} <span className="text-xs font-normal text-slate-400 ml-1">requested {req.coinsRequested} coins</span></h3>
                                  <p className="text-xs text-slate-400 mt-0.5">Method: {req.method} | TID: {req.transactionId}</p>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${req.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500' : req.status === 'APPROVED' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                  {req.status}
                              </span>
                          </div>

                          <div className="mb-4">
                              <p className="text-xs text-slate-400 mb-1">Screenshot Proof:</p>
                              <img src={`/uploads/${req.screenshotUrl}`} alt="Payment Proof" className="w-full h-32 object-cover rounded-lg border border-slate-600" />
                          </div>

                          {req.status === 'PENDING' && (
                              <div className="flex space-x-2">
                                  <button onClick={() => handleProcessPayment(req.id, 'APPROVED')} className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center transition">
                                      <CheckCircle size={16} className="mr-1" /> Approve
                                  </button>
                                  <button onClick={() => handleProcessPayment(req.id, 'REJECTED')} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center transition">
                                      <XCircle size={16} className="mr-1" /> Reject
                                  </button>
                              </div>
                          )}
                      </div>
                  ))}
              </div>
          </div>
        )}

        {activeView === 'settings' && (
          <div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
                Payment Settings
            </h2>
            <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700">
                    <h3 className="font-bold mb-3 flex items-center space-x-2">
                        <input type="checkbox" checked={appSettings.jazzcash_enabled === 'true'} onChange={(e) => setAppSettings({...appSettings, jazzcash_enabled: String(e.target.checked)})} className="w-4 h-4" />
                        <span>Enable JazzCash</span>
                    </h3>
                    <div className="space-y-3 pl-6">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Account Name</label>
                            <input type="text" value={appSettings.jazzcash_name} onChange={(e) => setAppSettings({...appSettings, jazzcash_name: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Account Number</label>
                            <input type="text" value={appSettings.jazzcash_number} onChange={(e) => setAppSettings({...appSettings, jazzcash_number: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700">
                    <h3 className="font-bold mb-3 flex items-center space-x-2">
                        <input type="checkbox" checked={appSettings.easypaisa_enabled === 'true'} onChange={(e) => setAppSettings({...appSettings, easypaisa_enabled: String(e.target.checked)})} className="w-4 h-4" />
                        <span>Enable Easypaisa</span>
                    </h3>
                    <div className="space-y-3 pl-6">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Account Name</label>
                            <input type="text" value={appSettings.easypaisa_name} onChange={(e) => setAppSettings({...appSettings, easypaisa_name: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Account Number</label>
                            <input type="text" value={appSettings.easypaisa_number} onChange={(e) => setAppSettings({...appSettings, easypaisa_number: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm" />
                        </div>
                    </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg transition">
                    Save Payment Settings
                </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
};

export default Admin;
