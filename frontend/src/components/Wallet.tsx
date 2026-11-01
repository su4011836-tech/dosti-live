import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Coins, CreditCard, History, Gift, ArrowUpRight } from 'lucide-react';
import api from '../api/client';

const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await api.get('/wallet');
        setBalance(res.data.balance);
      } catch (err) {
        console.error("Failed to load wallet balance");
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  return (
    <div className="min-h-screen bg-dark-darker pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center mb-4 sticky top-0 bg-dark-darker/90 backdrop-blur-md z-10">
        <button onClick={() => navigate(-1)} className="text-gray-300 hover:text-white transition p-2 -ml-2">
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-xl font-bold ml-2">My Wallet</h1>
      </div>

      {/* Balance Card */}
      <div className="px-4 mb-8">
        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl p-6 shadow-lg shadow-yellow-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-white/80 text-sm font-semibold mb-1">Total Balance</p>
            <div className="flex items-end space-x-2">
              <Coins size={36} className="text-yellow-200" />
              <h2 className="text-4xl font-black text-white">
                {loading ? '...' : balance.toLocaleString()}
              </h2>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex space-x-4 relative z-10">
            <button onClick={() => navigate('/recharge')} className="flex-1 bg-white text-orange-600 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-gray-50 transition shadow-md">
              <CreditCard size={18} />
              <span>Recharge</span>
            </button>
            <button className="flex-1 bg-black/20 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-black/30 transition backdrop-blur-sm">
              <ArrowUpRight size={18} />
              <span>Withdraw</span>
            </button>
          </div>

          {/* Decorations */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* Options */}
      <div className="px-4 space-y-4">
        <h3 className="font-bold text-gray-400 mb-2">Services</h3>

        <div className="bg-dark rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-dark-light transition shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-500/20 p-3 rounded-xl">
              <History size={24} className="text-blue-500" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Transaction History</h4>
              <p className="text-xs text-gray-500">View recent recharges and spending</p>
            </div>
          </div>
          <div className="text-gray-500">›</div>
        </div>

        <div className="bg-dark rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-dark-light transition shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-pink-500/20 p-3 rounded-xl">
              <Gift size={24} className="text-pink-500" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Gift Income</h4>
              <p className="text-xs text-gray-500">Track coins received from gifts</p>
            </div>
          </div>
          <div className="text-gray-500">›</div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
