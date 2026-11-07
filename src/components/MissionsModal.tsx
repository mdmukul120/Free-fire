import React from 'react';
import { Mission } from '../types/game';
import { soundManager } from '../audio/soundManager';
import { Target, X, CheckCircle, Diamond, Coins } from 'lucide-react';

interface MissionsModalProps {
  missions: Mission[];
  onClaimReward: (missionId: string) => void;
  onClose: () => void;
}

export const MissionsModal: React.FC<MissionsModalProps> = ({
  missions,
  onClaimReward,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-red-500/40 rounded-2xl shadow-[0_0_50px_rgba(255,70,85,0.4)] flex flex-col overflow-hidden cyber-border-angled">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
              <Target className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>দৈনিক ব্যাটল মিশন ও পুরস্কার</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-orbitron">
                  DAILY QUESTS
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                মিশন পূরণ করে ফ্রিতে জিতে নিন হীরা ও গোল্ড কয়েন!
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

        {/* Missions List */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {missions.map(m => {
            const progressPercent = Math.min(100, Math.round((m.progress / m.target) * 100));
            return (
              <div
                key={m.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                    <span>{m.title}</span>
                    {m.completed && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                        সম্পন্ন
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 mb-2">{m.description}</p>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-red-600 to-amber-500 h-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>প্রগ্রেস: {m.progress} / {m.target}</span>
                    <span>{progressPercent}%</span>
                  </div>
                </div>

                {/* Reward & Claim button */}
                <div className="flex items-center gap-3 sm:flex-col sm:items-end justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="flex items-center gap-1 text-cyan-400">
                      <Diamond className="w-3.5 h-3.5" /> +{m.rewardDiamonds}
                    </span>
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Coins className="w-3.5 h-3.5" /> +{m.rewardCoins}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (m.completed && !m.claimed) {
                        onClaimReward(m.id);
                      }
                    }}
                    disabled={!m.completed || m.claimed}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      m.claimed
                        ? 'bg-slate-800 text-slate-500 cursor-default'
                        : m.completed
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:from-emerald-400 hover:to-teal-500 cursor-pointer animate-pulse'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {m.claimed ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>ক্লেইম করা হয়েছে</span>
                      </>
                    ) : m.completed ? (
                      <span>পুরস্কার গ্রহণ করুন</span>
                    ) : (
                      <span>চলমান</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
