import React, { useState } from 'react';
import { WEAPONS, CHARACTERS } from '../data/gameData';
import { Weapon, Character } from '../types/game';
import { soundManager } from '../audio/soundManager';
import { ShoppingBag, X, Zap, Shield, Flame, Check, Coins, Diamond } from 'lucide-react';

interface StoreModalProps {
  userCoins: number;
  userDiamonds: number;
  selectedWeapon: Weapon;
  selectedCharacter: Character;
  onSelectWeapon: (weapon: Weapon) => void;
  onSelectCharacter: (char: Character) => void;
  onClose: () => void;
}

export const StoreModal: React.FC<StoreModalProps> = ({
  userCoins,
  userDiamonds,
  selectedWeapon,
  selectedCharacter,
  onSelectWeapon,
  onSelectCharacter,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'weapons' | 'characters'>('weapons');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-950 border border-red-500/40 rounded-2xl shadow-[0_0_50px_rgba(255,70,85,0.4)] flex flex-col overflow-hidden cyber-border-angled">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>সিটাডেল অস্ত্রাগার ও স্টোর (Armory Store)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-orbitron">
                  CYBER ARMORY
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                আপনার প্রিয় গান স্কিন ও ক্যারেক্টার আনলক এবং ইকুইপ করুন
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

        {/* Tabs */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-900/40 border-b border-slate-800">
          <div className="flex gap-2">
            <button
              onClick={() => {
                soundManager.play('ui_item_tap');
                setActiveTab('weapons');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'weapons'
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(255,70,85,0.5)]'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>অস্ত্রাগার (Weapons)</span>
            </button>
            <button
              onClick={() => {
                soundManager.play('ui_item_tap');
                setActiveTab('characters');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'characters'
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(255,70,85,0.5)]'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>বীর ও ভিলেন ক্যারেক্টার (Characters)</span>
            </button>
          </div>

          {/* Balance */}
          <div className="flex items-center gap-3 text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-yellow-950/40 border border-yellow-500/30 text-yellow-400">
              <Coins className="w-4 h-4" />
              <span>{userCoins.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-400">
              <Diamond className="w-4 h-4" />
              <span>{userDiamonds.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Grid Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'weapons' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {WEAPONS.map(wpn => {
                const isSelected = selectedWeapon.id === wpn.id;
                return (
                  <div
                    key={wpn.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-red-950/40 border-red-500 shadow-[0_0_20px_rgba(255,70,85,0.3)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-black/60 text-amber-400 font-orbitron border border-amber-500/30">
                          {wpn.rarity}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">{wpn.type}</span>
                      </div>

                      <h3 className="text-base font-bold text-white mb-1">{wpn.name}</h3>
                      <p className="text-xs text-amber-300 mb-3">{wpn.perk}</p>

                      <div className="space-y-1.5 text-xs text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-400">ড্যামেজ:</span>
                          <span className="font-bold text-red-400">{wpn.damage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">ফায়ার রেট:</span>
                          <span className="font-bold text-amber-400">{wpn.fireRate}/s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">ম্যাগাজিন:</span>
                          <span className="font-bold text-cyan-400">{wpn.magazine} রাউন্ড</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        soundManager.play('ui_purchase_confirm');
                        onSelectWeapon(wpn);
                      }}
                      className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-red-600 hover:bg-red-500 text-white'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>ইকুইপ করা আছে (EQUIPPED)</span>
                        </>
                      ) : (
                        <span>ইকুইপ করুন (EQUIP)</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CHARACTERS.map(char => {
                const isSelected = selectedCharacter.id === char.id;
                return (
                  <div
                    key={char.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-red-950/40 border-red-500 shadow-[0_0_20px_rgba(255,70,85,0.3)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={char.avatar}
                          alt={char.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-slate-700"
                        />
                        <div>
                          <h3 className="text-base font-bold text-white">{char.name}</h3>
                          <span className="text-[11px] text-amber-400 font-medium block">
                            {char.title}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 mb-3">
                        <div className="text-xs font-bold text-amber-400 mb-0.5">
                          {char.specialAbility.name}
                        </div>
                        <div className="text-[11px] text-slate-300 leading-relaxed">
                          {char.specialAbility.description}
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-400">স্বাস্থ্য (HP):</span>
                          <span className="font-bold text-emerald-400">{char.health} HP</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">গতিগুণক:</span>
                          <span className="font-bold text-cyan-400">{Math.round(char.speed * 100)}%</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        soundManager.play('ui_purchase_confirm');
                        onSelectCharacter(char);
                      }}
                      className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-red-600 hover:bg-red-500 text-white'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>সিলেক্ট করা আছে (SELECTED)</span>
                        </>
                      ) : (
                        <span>সিলেক্ট করুন (SELECT)</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
