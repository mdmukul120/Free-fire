import React from 'react';
import { PlayerStats, Character } from '../types/game';
import { soundManager } from '../audio/soundManager';
import { User, X, Award, Shield, Target, Flame, Trophy } from 'lucide-react';

interface ProfileModalProps {
  stats: PlayerStats;
  character: Character;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  stats,
  character,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-red-500/40 rounded-2xl shadow-[0_0_50px_rgba(255,70,85,0.4)] flex flex-col overflow-hidden cyber-border-angled">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>প্লেয়ার প্রোফাইল (Player Profile)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-orbitron">
                  UID: 9821-ROH-77
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                রোহান্স গেম সাইবার এরেনার সর্বকালের ম্যাচ রেকর্ড ও স্ট্যাটস
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.play('ui_close_back');
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Top Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/70 via-slate-900 to-amber-950/40 border border-red-500/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={character.avatar}
                alt={character.name}
                className="w-16 h-16 rounded-xl object-cover border-2 border-red-500 shadow-[0_0_15px_rgba(255,70,85,0.6)]"
              />
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>ROHAN PRO-GAMER</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-red-600 text-white font-orbitron">
                    LV. {stats.level}
                  </span>
                </h3>
                <p className="text-xs text-amber-300 font-semibold">{character.title}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                  <span>র‍্যাংক: <strong className="text-red-400 font-orbitron">{stats.rank}</strong></span>
                  <span>•</span>
                  <span>স্কোর: <strong className="text-amber-400">{stats.rankPoints} PTS</strong></span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-center p-3 rounded-lg bg-black/40 border border-amber-500/30">
              <Trophy className="w-6 h-6 text-amber-400 animate-pulse" />
              <span className="text-[10px] text-amber-300 font-bold mt-1 uppercase font-orbitron">
                HEROIC ELITE
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">মোট ব্যাটল</span>
              <span className="text-xl font-black text-white font-orbitron">{stats.matches}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">বুইয়া জয়</span>
              <span className="text-xl font-black text-amber-400 font-orbitron">{stats.wins}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">মোট কিলস</span>
              <span className="text-xl font-black text-red-400 font-orbitron">{stats.kills}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">হেডশট রেট</span>
              <span className="text-xl font-black text-emerald-400 font-orbitron">{stats.headshotRate}%</span>
            </div>
          </div>

          {/* Badges and Medals */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              অর্জিত ব্যাজ ও মেডেল (Achievements)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">রোহান্স চ্যাম্পিয়ন</h5>
                  <p className="text-[10px] text-slate-400">অ্যারেনা মাস্টার ব্যাজ</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">ওয়ান ট্যাপ গড</h5>
                  <p className="text-[10px] text-slate-400">১০০% নিখুঁত নিশানা</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">সিটাডেল ডিফেন্ডার</h5>
                  <p className="text-[10px] text-slate-400">বস রেইড বিজয়ী</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
