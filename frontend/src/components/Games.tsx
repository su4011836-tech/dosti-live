import React from 'react';
import { Coins, Gift, ChevronRight, Trophy, Users } from 'lucide-react';

const mockGames = [
  { id: 1, name: "Lucky Spin", desc: "Win up to 10k coins", icon: "🎡", color: "bg-purple-500", players: 1250 },
  { id: 2, name: "Ludo King", desc: "Classic 4-player ludo", icon: "🎲", color: "bg-blue-500", players: 3400 },
  { id: 3, name: "Dice Game", desc: "High or Low?", icon: "🎲", color: "bg-red-500", players: 800 },
  { id: 4, name: "Tic Tac Toe", desc: "Quick 1v1 match", icon: "❌", color: "bg-emerald-500", players: 450 },
  { id: 5, name: "Quiz Challenge", desc: "Test your knowledge", icon: "🧠", color: "bg-orange-500", players: 2100 },
  { id: 6, name: "Coin Flip", desc: "Heads or Tails", icon: "🪙", color: "bg-yellow-500", players: 1500 }
];

const Games: React.FC = () => {
  return (
    <div className="pb-24 pt-4 px-4 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Games Center</h1>
        <div className="bg-dark-light px-3 py-1.5 rounded-full flex items-center space-x-2">
          <Coins size={16} className="text-yellow-400" />
          <span className="font-bold text-sm">12,450</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-secondary-dark to-primary-dark rounded-2xl p-5 mb-8 shadow-lg relative overflow-hidden flex items-center justify-between">
        <div className="z-10">
          <h2 className="text-lg font-bold text-white flex items-center">
            <Gift size={20} className="mr-2 text-pink-300" /> Daily Free Spin!
          </h2>
          <p className="text-sm text-gray-200 mt-1">Claim your daily reward now</p>
        </div>
        <button className="z-10 bg-white text-secondary-dark px-4 py-2 rounded-full font-bold shadow-md hover:bg-gray-100 transition text-sm">
          Claim
        </button>
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
      </div>

      <div className="bg-dark p-4 rounded-xl mb-8 flex items-center justify-between shadow-inner cursor-pointer hover:bg-dark-light transition">
        <div className="flex items-center space-x-3">
          <div className="bg-yellow-500/20 p-2 rounded-full">
            <Trophy size={20} className="text-yellow-500" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Weekly Leaderboard</h3>
            <p className="text-xs text-gray-400">See top players</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-gray-500" />
      </div>

      <h3 className="font-bold text-lg mb-4">All Games</h3>
      <div className="grid grid-cols-2 gap-4">
        {mockGames.map(game => (
          <div key={game.id} className="bg-dark rounded-2xl p-4 shadow-md flex flex-col items-center text-center cursor-pointer hover:bg-dark-light hover:scale-105 transition group relative">
            <div className="absolute top-2 right-2 flex items-center space-x-1">
              <Users size={10} className="text-gray-400" />
              <span className="text-[10px] text-gray-400">{game.players}</span>
            </div>

            <div className={`w-14 h-14 ${game.color} rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-lg group-hover:animate-bounce`}>
              {game.icon}
            </div>
            <h4 className="font-bold text-sm mb-1">{game.name}</h4>
            <p className="text-xs text-gray-400">{game.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;