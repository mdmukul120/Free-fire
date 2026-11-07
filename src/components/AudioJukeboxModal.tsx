import React, { useState } from 'react';
import { AUDIO_CATALOG, soundManager, AudioItem } from '../audio/soundManager';
import { Volume2, X, Music, Mic, Zap, Shield, Play } from 'lucide-react';

interface AudioJukeboxModalProps {
  onClose: () => void;
}

export const AudioJukeboxModal: React.FC<AudioJukeboxModalProps> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'voice' | 'boss' | 'sfx' | 'music'>('all');
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  const items = Object.values(AUDIO_CATALOG).filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handlePlaySound = (item: AudioItem) => {
    setActivePlayingId(item.id);
    soundManager.play(item.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-950 border border-red-500/40 rounded-2xl shadow-[0_0_50px_rgba(255,70,85,0.4)] flex flex-col overflow-hidden cyber-border-angled">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>রোহান্স গেম ভয়েস ও অডিও সাউন্ডবোর্ড</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-orbitron">
                  36 AUDIO TRACKS
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                গেমের সব বাংলা ভয়েস লাইন, বস সংলাপ ও ব্যাকগ্রাউন্ড মিউজিক এক জায়গায়
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

        {/* Filter Categories */}
        <div className="flex items-center gap-2 px-6 py-3 bg-slate-900/40 border-b border-slate-800/80 overflow-x-auto">
          {[
            { id: 'all', label: 'সকল অডিও (All)', icon: Volume2 },
            { id: 'voice', label: 'বাংলা ভয়েস লাইন (Voice)', icon: Mic },
            { id: 'boss', label: 'ব্লেড বস গর্জন (Boss)', icon: Shield },
            { id: 'sfx', label: 'UI সাউন্ড এফেক্টস (SFX)', icon: Zap },
            { id: 'music', label: 'থিম মিউজিক (Music)', icon: Music }
          ].map(cat => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundManager.play('ui_item_tap');
                  setSelectedCategory(cat.id as any);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  active 
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(255,70,85,0.6)]' 
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Audio Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map(item => {
            const isPlaying = activePlayingId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handlePlaySound(item)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isPlaying 
                    ? 'bg-red-950/40 border-red-500 shadow-[0_0_20px_rgba(255,70,85,0.3)]' 
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition ${
                    isPlaying 
                      ? 'bg-red-600 text-white animate-pulse' 
                      : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                  }`}>
                    {isPlaying ? <Volume2 className="w-5 h-5" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <span>{item.bengaliName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-orbitron">
                        {item.category}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {item.name}
                    </p>
                    {item.subtitles && (
                      <p className="text-xs text-amber-300/90 mt-1 italic line-clamp-1">
                        "{item.subtitles}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1">
                  <span>প্লে</span>
                  <span>▶</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>ক্লিক করে যেকোনো ভয়েস ও সাউন্ড সরাসরি টেস্ট করুন</span>
          </div>
          <button
            onClick={() => {
              soundManager.playBGM();
            }}
            className="px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/30 font-semibold"
          >
            লবি মিউজিক রিস্টার্ট করুন
          </button>
        </div>

      </div>
    </div>
  );
};
