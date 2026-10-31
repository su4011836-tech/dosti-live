import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Edit3, Shield, Star, Coins, Gift, CreditCard, LogOut, ChevronRight, User, History } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

interface ProfileData {
  id: string;
  username: string;
  level: number;
  isVIP: boolean;
  coins: number;
  wallet?: {
    balance: number;
  };
  _count: {
    rooms: number;
    giftsSent: number;
    giftsRecv: number;
  }
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center text-white">Loading profile...</div>;
  }

  if (!profile) {
     return <div className="min-h-screen flex items-center justify-center text-white">Could not load profile.</div>;
  }

  return (
    <div className="pb-24 pt-4 min-h-screen">
      <div className="px-4 flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <button className="text-gray-300 hover:text-white transition">
          <Settings size={24} />
        </button>
      </div>

      <div className="px-4 mb-6">
        <div className="bg-gradient-to-b from-dark-light to-dark rounded-3xl p-6 shadow-xl relative overflow-hidden border border-gray-800">
          <div className="flex items-center space-x-5 relative z-10">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-light to-secondary-light p-1">
                <div className="w-full h-full rounded-full bg-dark flex items-center justify-center border-2 border-dark">
                  <User size={40} className="text-gray-400" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-dark shadow-sm">
                LVL {profile.level}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center">
                    {profile.username} {profile.isVIP && <Shield size={14} className="ml-2 text-green-400" />}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1 flex truncate w-32">ID: {profile.id.split('-')[0]}</p>
                </div>
                <button className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition">
                  <Edit3 size={16} />
                </button>
              </div>
              <div className="mt-3 flex space-x-4 text-sm font-semibold">
                <div className="flex flex-col"><span className="text-white">{profile._count.giftsSent}</span><span className="text-xs text-gray-500 font-normal">Sent</span></div>
                <div className="flex flex-col"><span className="text-white">{profile._count.giftsRecv}</span><span className="text-xs text-gray-500 font-normal">Recv</span></div>
                <div className="flex flex-col"><span className="text-white">{profile._count.rooms}</span><span className="text-xs text-gray-500 font-normal">Rooms</span></div>
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full blur-xl"></div>
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div onClick={() => navigate('/wallet')} className="bg-dark rounded-2xl p-4 flex items-center space-x-3 shadow-md cursor-pointer hover:bg-dark-light transition">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Coins size={20} className="text-yellow-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">My Wallet</p>
              <h3 className="text-base font-bold text-white">{profile.wallet?.balance || 0}</h3>
            </div>
          </div>
          <div className="bg-dark rounded-2xl p-4 flex items-center space-x-3 shadow-md cursor-pointer hover:bg-dark-light transition">
            <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
              <Gift size={20} className="text-pink-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">My Gifts</p>
              <h3 className="text-base font-bold text-white">48</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-2">Services</h3>

        <div className="bg-dark rounded-2xl overflow-hidden shadow-sm">
          <button onClick={() => navigate('/wallet')} className="w-full flex items-center justify-between p-4 hover:bg-dark-light transition group">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400"><CreditCard size={20} /></div>
              <span className="font-semibold text-sm">Wallet & Recharge</span>
            </div>
            <ChevronRight size={18} className="text-gray-500 group-hover:text-white transition" />
          </button>
          <div className="h-px bg-gray-800 ml-14"></div>

          <button className="w-full flex items-center justify-between p-4 hover:bg-dark-light transition group">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-400"><Star size={20} /></div>
              <span className="font-semibold text-sm">VIP Center</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold">New</span>
              <ChevronRight size={18} className="text-gray-500 group-hover:text-white transition" />
            </div>
          </button>
          <div className="h-px bg-gray-800 ml-14"></div>

          <button className="w-full flex items-center justify-between p-4 hover:bg-dark-light transition group">
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400"><History size={20} /></div>
              <span className="font-semibold text-sm">Transaction History</span>
            </div>
            <ChevronRight size={18} className="text-gray-500 group-hover:text-white transition" />
          </button>
        </div>

        <div className="bg-dark rounded-2xl overflow-hidden shadow-sm mt-4">
          <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 hover:bg-red-500/10 transition group">
            <div className="flex items-center space-x-4">
              <div className="bg-red-500/20 p-2 rounded-lg text-red-500"><LogOut size={20} /></div>
              <span className="font-semibold text-sm text-red-500">Log Out</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;