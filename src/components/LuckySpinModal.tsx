import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { SPIN_REWARDS } from '../data/gameData';
import { SpinReward } from '../types/game';
import { soundManager } from '../audio/soundManager';
import { Sparkles, X, Gift, Diamond, Coins, Flame } from 'lucide-react';

interface LuckySpinModalProps {
  userCoins: number;
  userDiamonds: number;
  onRewardWon: (reward: SpinReward) => void;
  onClose: () => void;
}

export const LuckySpinModal: React.FC<LuckySpinModalProps> = ({
  userCoins,
  userDiamonds,
  onRewardWon,
  onClose
}) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonReward, setWonReward] = useState<SpinReward | null>(null);

  const spinCost = 100; // 100 coins

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleSpin = () => {
    if (spinning) return;
    if (userCoins < spinCost) {
      soundManager.play('ui_matchmaking_cancel');
      alert('পর্যাপ্ত কয়েন নেই! আরও কয়েন সংগ্রহ করুন।');
      return;
    }

    setSpinning(true);
    setWonReward(null);
    soundManager.play('ui_mode_select');

    // Pick random reward
    const rewardIndex = Math.floor(Math.random() * SPIN_REWARDS.length);
    const selectedReward = SPIN_REWARDS[rewardIndex];

    // Calculate rotation: multiple full rounds + slice angle
    const sliceAngle = 360 / SPIN_REWARDS.length;
    const extraRounds = 5 * 360; // 5 full spins
    const targetAngle = extraRounds + (360 - rewardIndex * sliceAngle) + (sliceAngle / 2);

    const newRotation = rotation + targetAngle;
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setWonReward(selectedReward);
      onRewardWon(selectedReward);

      if (selectedReward.rarity === 'Mythic' || selectedReward.rarity === 'Legendary') {
        soundManager.play('ui_congratulations_rare');
        triggerConfetti();
      } else {
        soundManager.play('ui_congratulations');
      }
      soundManager.play('ui_claim_coin');
    }, 3800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-950 border border-amber-500/40 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.3)] flex flex-col overflow-hidden cyber-border-angled">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Gift className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>লাকি রয়্যাল স্পিন (Lucky Wheel)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-orbitron">
                  DAILY DRAW
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                স্পিন করে জিতে নিন দুর্লভ গান স্কিন, হীরা ও কুট্টুস পেট!
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

        {/* Wheel Body */}
        <div className="p-6 flex flex-col items-center justify-center">
          
          {/* Wheel Container */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center mb-6">
            
            {/* Top Pointer Arrow */}
            <div className="absolute -top-3 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,1)]" />

            {/* Glowing Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.5)] pointer-events-none" />

            {/* Rotating Wheel Disk */}
            <div
              className="w-full h-full rounded-full relative overflow-hidden transition-all ease-out"
              style={{
                transform: `rotate(${rotation}deg)`,
                transitionDuration: spinning ? '3.8s' : '0s',
                background: 'conic-gradient(#1e1b4b 0deg 45deg, #311042 45deg 90deg, #1e1b4b 90deg 135deg, #311042 135deg 180deg, #1e1b4b 180deg 225deg, #311042 225deg 270deg, #1e1b4b 270deg 315deg, #311042 315deg 360deg)'
              }}
            >
              {SPIN_REWARDS.map((reward, i) => {
                const angle = (i * 360) / SPIN_REWARDS.length + 22.5;
                return (
                  <div
                    key={reward.id}
                    className="absolute w-full h-full top-0 left-0 flex items-start justify-center pt-3 select-none"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <span className="text-[11px] font-bold text-amber-300 drop-shadow-md max-w-[70px] leading-tight">
                        {reward.name}
                      </span>
                      <span className="text-[9px] text-slate-300 uppercase px-1 rounded bg-black/50 mt-0.5">
                        {reward.rarity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Center Golden Pin */}
            <div className="absolute z-10 w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 border-2 border-white/60 shadow-[0_0_20px_rgba(245,158,11,0.9)] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-slate-950 animate-spin" />
            </div>
          </div>

          {/* Won Reward Alert Box */}
          {wonReward && (
            <div className="w-full p-3 mb-4 rounded-xl bg-gradient-to-r from-amber-950/80 to-slate-900 border border-amber-500/60 flex items-center justify-between animate-bounce">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500 text-slate-950 font-bold">
                  ★
                </div>
                <div>
                  <div className="text-xs text-amber-300 font-bold">অভিনন্দন! আপনি জিতেছেন:</div>
                  <div className="text-sm font-extrabold text-white">{wonReward.name}</div>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-black uppercase font-orbitron">
                {wonReward.rarity}
              </span>
            </div>
          )}

          {/* Spin Trigger Button */}
          <button
            onClick={handleSpin}
            disabled={spinning}
            className={`w-full py-3.5 rounded-xl font-extrabold text-base tracking-wider transition-all transform flex items-center justify-center gap-2 shadow-xl ${
              spinning
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 active:scale-95 shadow-[0_0_25px_rgba(245,158,11,0.5)]'
            }`}
          >
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span>{spinning ? 'স্পিন ঘুরছে...' : `স্পিন করুন (১০০ কয়েন)`}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
