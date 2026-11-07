import React, { useState, useEffect, useRef } from 'react';
import { RohansGameIntro } from './components/RohansGameIntro';
import { AudioJukeboxModal } from './components/AudioJukeboxModal';
import { LuckySpinModal } from './components/LuckySpinModal';
import { StoreModal } from './components/StoreModal';
import { MissionsModal } from './components/MissionsModal';
import { ProfileModal } from './components/ProfileModal';
import { GameEngine } from './game/GameEngine';
import { CHARACTERS, WEAPONS, MISSIONS } from './data/gameData';
import { Character, Weapon, GameScreen, GameMode, PlayerStats, SpinReward } from './types/game';
import { soundManager } from './audio/soundManager';
import confetti from 'canvas-confetti';
import { 
  Volume2, VolumeX, Shield, Zap, Flame, Trophy, 
  ShoppingBag, Target, User, Gift, Mic, Play, 
  Crosshair, RotateCcw, ArrowRight, Sparkles, Diamond, Coins
} from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('intro_rohan');
  const [gameMode, setGameMode] = useState<GameMode>('solo_1v1');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);

  // User stats & inventory
  const [stats, setStats] = useState<PlayerStats>({
    level: 12,
    exp: 4200,
    maxExp: 6000,
    coins: 4850,
    diamonds: 320,
    rank: 'গ্র্যান্ডমাস্টার (Heroic)',
    rankPoints: 3450,
    wins: 28,
    matches: 34,
    kills: 142,
    headshotRate: 64
  });

  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CHARACTERS[0]);
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon>(WEAPONS[0]);
  const [missions, setMissions] = useState(MISSIONS);

  // Active Modals
  const [activeModal, setActiveModal] = useState<'jukebox' | 'spin' | 'store' | 'missions' | 'profile' | null>(null);

  // Battle State
  const [playerHp, setPlayerHp] = useState(200);
  const [playerMaxHp, setPlayerMaxHp] = useState(200);
  const [enemyHp, setEnemyHp] = useState(200);
  const [enemyMaxHp, setEnemyMaxHp] = useState(200);
  const [currentAmmo, setCurrentAmmo] = useState(35);
  const [maxAmmo, setMaxAmmo] = useState(35);
  const [activeDialogue, setActiveDialogue] = useState<{ text: string; speaker: string; color: string } | null>(null);
  const [abilityCooldown, setAbilityCooldown] = useState(0);

  // Matchmaking timer
  const [matchmakingTime, setMatchmakingTime] = useState(0);

  // 3D Canvas container ref & Game Engine instance
  const battleContainerRef = useRef<HTMLDivElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);

  // Joystick touch tracking
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isJoystickActive, setIsJoystickActive] = useState(false);

  // Listen to sound subtitles
  useEffect(() => {
    const unsubscribe = soundManager.subscribeSubtitles((text) => {
      if (text) {
        setActiveDialogue({ text, speaker: 'ভয়েস সংলাপ', color: '#ff4655' });
      } else {
        setActiveDialogue(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Cooldown ticker
  useEffect(() => {
    if (abilityCooldown <= 0) return;
    const timer = setInterval(() => {
      setAbilityCooldown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [abilityCooldown]);

  // Handle Matchmaking Timer
  useEffect(() => {
    if (screen !== 'matchmaking') return;
    const interval = setInterval(() => {
      setMatchmakingTime(t => {
        if (t >= 3) {
          clearInterval(interval);
          startBattle();
          return 0;
        }
        return t + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [screen]);

  // Audio Toggle
  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // Login click to Lobby
  const handleEnterGame = () => {
    soundManager.play('login_enter_game');
    soundManager.playBGM();
    setScreen('lobby');
  };

  // Start Matchmaking
  const handleStartMatchmaking = () => {
    soundManager.play('ui_matchmaking_start');
    setMatchmakingTime(0);
    setScreen('matchmaking');
  };

  const handleCancelMatchmaking = () => {
    soundManager.play('ui_matchmaking_cancel');
    setScreen('lobby');
  };

  // Launch 3D Battle Arena
  const startBattle = () => {
    soundManager.stopBGM();
    setScreen('battle');

    // Determine enemy based on gameMode
    const enemy = (gameMode === 'boss_raid') 
      ? CHARACTERS.find(c => c.id === 'blade_boss')!
      : CHARACTERS.find(c => c.id === 'raad_vai')!;

    setPlayerHp(selectedCharacter.health);
    setPlayerMaxHp(selectedCharacter.maxHealth);
    setEnemyHp(enemy.health);
    setEnemyMaxHp(enemy.maxHealth);
    setCurrentAmmo(selectedWeapon.magazine);
    setMaxAmmo(selectedWeapon.magazine);

    setTimeout(() => {
      if (battleContainerRef.current) {
        if (gameEngineRef.current) {
          gameEngineRef.current.destroy();
        }
        gameEngineRef.current = new GameEngine(
          battleContainerRef.current,
          selectedCharacter,
          enemy,
          selectedWeapon,
          {
            onPlayerHealthChange: (hp, max) => {
              setPlayerHp(hp);
              setPlayerMaxHp(max);
            },
            onEnemyHealthChange: (hp, max) => {
              setEnemyHp(hp);
              setEnemyMaxHp(max);
            },
            onAmmoChange: (curr, max) => {
              setCurrentAmmo(curr);
              setMaxAmmo(max);
            },
            onScoreChange: (kills, heads) => {
              setStats(prev => ({
                ...prev,
                kills: prev.kills + kills,
                headshotRate: Math.round(((heads + 1) / (kills + 1)) * 100)
              }));
            },
            onDialogue: (text, speaker, color) => {
              setActiveDialogue({ text, speaker, color });
              setTimeout(() => setActiveDialogue(null), 3800);
            },
            onBattleEnd: (won) => {
              if (gameEngineRef.current) {
                gameEngineRef.current.destroy();
                gameEngineRef.current = null;
              }
              if (won) {
                setStats(prev => ({
                  ...prev,
                  wins: prev.wins + 1,
                  matches: prev.matches + 1,
                  coins: prev.coins + 350,
                  diamonds: prev.diamonds + 25,
                  rankPoints: prev.rankPoints + 45
                }));
                confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
                setScreen('victory');
              } else {
                setStats(prev => ({
                  ...prev,
                  matches: prev.matches + 1,
                  rankPoints: Math.max(0, prev.rankPoints - 15)
                }));
                setScreen('defeat');
              }
            }
          }
        );
      }
    }, 100);
  };

  // Virtual Joystick handlers for mobile touch
  const handleJoystickStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsJoystickActive(true);
  };

  const handleJoystickMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isJoystickActive || !joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.min(45, Math.hypot(deltaX, deltaY));
    const angle = Math.atan2(deltaY, deltaX);

    const stickX = Math.cos(angle) * distance;
    const stickY = Math.sin(angle) * distance;

    setJoystickPos({ x: stickX, y: stickY });

    if (gameEngineRef.current) {
      gameEngineRef.current.setJoystickInput(stickX / 45, stickY / 45);
    }
  };

  const handleJoystickEnd = () => {
    setIsJoystickActive(false);
    setJoystickPos({ x: 0, y: 0 });
    if (gameEngineRef.current) {
      gameEngineRef.current.setJoystickInput(0, 0);
    }
  };

  // Look swiping on canvas
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleLookTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0].clientX > window.innerWidth / 2) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleLookTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !gameEngineRef.current) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartRef.current.x;
    const deltaY = currentY - touchStartRef.current.y;

    gameEngineRef.current.rotateCamera(deltaX, deltaY);
    touchStartRef.current = { x: currentX, y: currentY };
  };

  const handleLookTouchEnd = () => {
    touchStartRef.current = null;
  };

  // Claim Mission Reward
  const handleClaimMission = (id: string) => {
    const mission = missions.find(m => m.id === id);
    if (!mission) return;

    soundManager.play('ui_claim_coin');
    setStats(prev => ({
      ...prev,
      diamonds: prev.diamonds + mission.rewardDiamonds,
      coins: prev.coins + mission.rewardCoins
    }));

    setMissions(prev =>
      prev.map(m => (m.id === id ? { ...m, claimed: true } : m))
    );
  };

  // Claim Spin Reward
  const handleRewardWon = (reward: SpinReward) => {
    setStats(prev => {
      let coins = prev.coins - 100; // deduct cost
      let diamonds = prev.diamonds;
      if (reward.type === 'diamonds' && reward.amount) diamonds += reward.amount;
      if (reward.type === 'coins' && reward.amount) coins += reward.amount;
      return { ...prev, coins, diamonds };
    });
  };

  // Render Screens
  return (
    <div className="relative w-screen h-screen bg-slate-950 text-white overflow-hidden select-none">
      
      {/* 1. ROHAN'S GAME INTRO ANIMATION */}
      {screen === 'intro_rohan' && (
        <RohansGameIntro onComplete={() => setScreen('login')} />
      )}

      {/* 2. LOGIN / TITLE SCREEN */}
      {screen === 'login' && (
        <div 
          onClick={handleEnterGame}
          className="fixed inset-0 z-40 flex flex-col items-center justify-between p-8 bg-[radial-gradient(ellipse_at_center,_rgba(255,70,85,0.3)_0%,_rgba(10,12,24,0.95)_70%)] cyber-grid cursor-pointer animate-fade-in"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between w-full max-w-5xl">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded bg-red-600/30 text-red-400 border border-red-500/40 font-orbitron font-bold">
                VERSION 2.4.0 • MAX
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
            </button>
          </div>

          {/* Center Titles */}
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-amber-400 text-xs sm:text-sm font-bold tracking-widest uppercase mb-4 animate-pulse">
              <Flame className="w-4 h-4 text-red-500" />
              <span>রোহান্স গেম প্রেজেন্টস • বাংলা অ্যারেনা</span>
              <Flame className="w-4 h-4 text-red-500" />
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-red-500 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(255,70,85,0.8)] font-sans">
              রোহান্স গেম
            </h1>

            <p className="text-lg sm:text-2xl font-black text-slate-200 tracking-wider mt-2 font-orbitron">
              FREAK 22 VS RAAD VAI YT: CYBER CITADEL
            </p>

            {/* Tap to enter banner */}
            <div className="mt-12 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-extrabold text-base sm:text-lg tracking-widest uppercase shadow-[0_0_35px_rgba(255,70,85,0.8)] animate-pulse flex items-center gap-3 cyber-badge-angled">
              <Play className="w-5 h-5 fill-current" />
              <span>গেমে প্রবেশ করতে ট্যাপ করুন (TAP TO ENTER)</span>
            </div>
          </div>

          <div className="text-xs text-slate-500 text-center font-mono">
            VERCEL & GITHUB DEPLOY READY • POWERED BY THREE.JS & REACT
          </div>
        </div>
      )}

      {/* 3. MAIN LOBBY SCREEN */}
      {screen === 'lobby' && (
        <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-radial-gradient from-slate-900 via-slate-950 to-black overflow-hidden">
          {/* Cyber grid overlay */}
          <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

          {/* Top Bar: Profile & Currencies */}
          <div className="relative z-10 flex items-center justify-between w-full">
            {/* Player badge */}
            <div 
              onClick={() => {
                soundManager.play('ui_profile_open');
                setActiveModal('profile');
              }}
              className="flex items-center gap-3 p-2 pr-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-red-500/50 cursor-pointer transition backdrop-blur-sm"
            >
              <img
                src={selectedCharacter.avatar}
                alt="Avatar"
                className="w-10 h-10 rounded-lg object-cover border border-red-500"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">ROHAN PRO</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-600 text-white font-orbitron font-bold">
                    LV.{stats.level}
                  </span>
                </div>
                <div className="text-[11px] text-amber-400 font-semibold">{stats.rank}</div>
              </div>
            </div>

            {/* Currencies & Audio */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-950/40 border border-yellow-500/30 text-yellow-400 text-xs sm:text-sm font-bold">
                <Coins className="w-4 h-4" />
                <span>{stats.coins.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-bold">
                <Diamond className="w-4 h-4" />
                <span>{stats.diamonds.toLocaleString()}</span>
              </div>

              <button
                onClick={toggleMute}
                className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
          </div>

          {/* Center Character Preview & Stage */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-4">
            <div className="relative flex flex-col items-center">
              {/* Glowing floor pedestal */}
              <div className="absolute -bottom-8 w-64 sm:w-80 h-12 bg-red-600/30 rounded-full blur-xl animate-pulse" />
              <div className="absolute -bottom-2 w-48 sm:w-60 h-4 bg-gradient-to-r from-red-500 to-amber-500 rounded-full shadow-[0_0_20px_rgba(255,70,85,0.8)]" />

              {/* Character Illustration */}
              <div className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-2xl overflow-hidden border-2 border-red-500/50 shadow-[0_0_35px_rgba(255,70,85,0.5)] bg-slate-900">
                <img
                  src={selectedCharacter.avatar}
                  alt={selectedCharacter.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-xs px-2 py-0.5 rounded bg-red-600/80 text-white font-bold inline-block font-orbitron mb-1">
                    {selectedCharacter.name}
                  </div>
                  <div className="text-xs text-amber-300 font-semibold">{selectedCharacter.title}</div>
                </div>
              </div>

              {/* Equipped Weapon Banner */}
              <div className="mt-4 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 backdrop-blur-md">
                <Zap className="w-4 h-4 text-amber-400" />
                <div className="text-xs">
                  <span className="text-slate-400">অস্ত্র: </span>
                  <span className="font-bold text-white">{selectedWeapon.name}</span>
                  <span className="ml-2 text-[10px] text-red-400 font-orbitron font-bold">({selectedWeapon.rarity})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Left Side Quick Menu: New Features & Stores */}
          <div className="absolute left-4 top-24 z-20 flex flex-col gap-2.5">
            <button
              onClick={() => {
                soundManager.play('ui_mode_select');
                setActiveModal('spin');
              }}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600/80 to-yellow-600/80 border border-amber-400/60 text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition"
            >
              <Gift className="w-4 h-4 text-amber-200 animate-bounce" />
              <span>লাকি স্পিন (Lucky Wheel)</span>
            </button>

            <button
              onClick={() => {
                soundManager.play('ui_store_open');
                setActiveModal('jukebox');
              }}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/50 text-cyan-300 text-xs font-bold flex items-center gap-2 shadow-lg hover:border-cyan-400 transition"
            >
              <Mic className="w-4 h-4 text-cyan-400" />
              <span>বাংলা ভয়েস সাউন্ডবোর্ড</span>
            </button>

            <button
              onClick={() => {
                soundManager.play('ui_store_open');
                setActiveModal('store');
              }}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 hover:border-red-500 transition"
            >
              <ShoppingBag className="w-4 h-4 text-red-400" />
              <span>অস্ত্রাগার ও স্টোর</span>
            </button>

            <button
              onClick={() => {
                soundManager.play('ui_missions_open');
                setActiveModal('missions');
              }}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 hover:border-amber-500 transition"
            >
              <Target className="w-4 h-4 text-amber-400" />
              <span>দৈনিক মিশন</span>
            </button>
          </div>

          {/* Bottom Bar: Mode Selector & Big START Button */}
          <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            {/* Mode selection buttons */}
            <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
              {[
                { id: 'solo_1v1', label: '1v1 সোলো ক্ল্যাশ (vs Raad Vai)' },
                { id: 'boss_raid', label: 'বস রেইড (vs Blade Boss)' },
                { id: 'ranked_citadel', label: 'র‍্যাংকড সিটাডেল' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    soundManager.play('ui_item_tap');
                    setGameMode(m.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    gameMode === m.id
                      ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(255,70,85,0.6)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Start Match Button */}
            <button
              onClick={handleStartMatchmaking}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white text-base sm:text-lg font-black tracking-wider uppercase shadow-[0_0_35px_rgba(255,70,85,0.8)] active:scale-95 transition transform flex items-center justify-center gap-3 cyber-border-angled"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>ম্যাচ শুরু করুন (START BATTLE)</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. MATCHMAKING SCREEN */}
      {screen === 'matchmaking' && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center p-6 bg-slate-950 cyber-grid">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center mb-8">
            <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-ping opacity-40" />
            <div className="absolute inset-4 rounded-full border border-amber-500/40 animate-spin" />
            <div className="w-48 h-48 rounded-full bg-slate-900 border-2 border-red-500 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(255,70,85,0.7)]">
              <Crosshair className="w-12 h-12 text-red-500 animate-pulse mb-2" />
              <div className="text-sm font-bold text-slate-200">ম্যাচ খোঁজা হচ্ছে...</div>
              <div className="text-2xl font-black text-amber-400 font-orbitron mt-1">
                00:0{matchmakingTime}
              </div>
            </div>
          </div>

          <h3 className="text-lg font-extrabold text-white mb-2 font-sans">
            সাইবার সিটাডেল সার্ভারে এনিমি ট্র্যাকিং চলছে
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            মোড: {gameMode === 'boss_raid' ? 'ব্লেড বস টাইটান রেইড' : 'সোলো 1v1 ব্যাটেল'}
          </p>

          <button
            onClick={handleCancelMatchmaking}
            className="px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-red-500 text-slate-300 hover:text-white text-xs font-bold transition"
          >
            বাতিল করুন (CANCEL)
          </button>
        </div>
      )}

      {/* 5. 3D BATTLE ARENA */}
      {screen === 'battle' && (
        <div 
          className="relative w-full h-full overflow-hidden select-none"
          onTouchStart={handleLookTouchStart}
          onTouchMove={handleLookTouchMove}
          onTouchEnd={handleLookTouchEnd}
        >
          {/* Three.js Container */}
          <div ref={battleContainerRef} className="absolute inset-0 z-0" />

          {/* Top HUD: Health Bars */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-start justify-between gap-4 pointer-events-none">
            {/* Player HP */}
            <div className="w-44 sm:w-56 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md">
              <div className="flex justify-between items-center text-xs font-bold mb-1">
                <span className="text-white">{selectedCharacter.name}</span>
                <span className="text-emerald-400 font-orbitron">{playerHp} / {playerMaxHp}</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-200"
                  style={{ width: `${(playerHp / playerMaxHp) * 100}%` }}
                />
              </div>
            </div>

            {/* Crosshair Center Reticle */}
            <div className="hidden sm:flex items-center justify-center pointer-events-none">
              <div className="w-6 h-6 border-2 border-red-500/70 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
              </div>
            </div>

            {/* Enemy HP */}
            <div className="w-44 sm:w-56 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md">
              <div className="flex justify-between items-center text-xs font-bold mb-1">
                <span className="text-red-400 font-orbitron">{enemyHp} / {enemyMaxHp}</span>
                <span className="text-white">
                  {gameMode === 'boss_raid' ? 'Blade Boss' : 'Raad Vai YT'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-600 to-rose-400 h-full transition-all duration-200"
                  style={{ width: `${(enemyHp / enemyMaxHp) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Bengali Voice Subtitle Banner */}
          {activeDialogue && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 max-w-lg w-[90%] px-4 py-2.5 rounded-xl bg-slate-950/90 border border-red-500/50 shadow-[0_0_25px_rgba(255,70,85,0.5)] flex items-center gap-3 backdrop-blur-md animate-bounce pointer-events-none">
              <div className="p-1.5 rounded-lg bg-red-600 text-white font-bold text-xs">
                🎙
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: activeDialogue.color }}>
                  {activeDialogue.speaker}
                </span>
                <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                  "{activeDialogue.text}"
                </p>
              </div>
            </div>
          )}

          {/* Bottom Controls HUD */}
          <div className="absolute bottom-6 left-6 right-6 z-20 flex items-end justify-between pointer-events-auto">
            
            {/* Virtual Joystick for Left Thumb */}
            <div
              ref={joystickBaseRef}
              onTouchStart={handleJoystickStart}
              onTouchMove={handleJoystickMove}
              onTouchEnd={handleJoystickEnd}
              onMouseDown={handleJoystickStart}
              onMouseMove={handleJoystickMove}
              onMouseUp={handleJoystickEnd}
              className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-950/70 border-2 border-slate-700/80 flex items-center justify-center backdrop-blur-sm touch-none"
            >
              <div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-amber-500 shadow-[0_0_15px_rgba(255,70,85,0.8)] border border-white/50"
                style={{ transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)` }}
              />
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-col items-end gap-3">
              
              {/* Ammo Display */}
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-bold text-amber-400 flex items-center gap-2">
                <span>এমো:</span>
                <span className="text-base text-white font-orbitron">{currentAmmo} / {maxAmmo}</span>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-3">
                {/* Reload Button */}
                <button
                  onClick={() => gameEngineRef.current?.reload()}
                  className="w-12 h-12 rounded-2xl bg-slate-900/90 border border-slate-700 hover:border-white text-slate-300 flex items-center justify-center active:scale-90 transition shadow-lg"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                {/* Special Ability Button */}
                <button
                  onClick={() => {
                    if (abilityCooldown <= 0) {
                      gameEngineRef.current?.useSpecialAbility();
                      setAbilityCooldown(selectedCharacter.specialAbility.cooldown);
                    }
                  }}
                  disabled={abilityCooldown > 0}
                  className={`w-14 h-14 rounded-2xl border flex flex-col items-center justify-center transition shadow-lg ${
                    abilityCooldown > 0
                      ? 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-br from-amber-500 to-yellow-600 border-amber-300 text-slate-950 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.6)]'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="text-[10px] font-black mt-0.5 font-orbitron">
                    {abilityCooldown > 0 ? `${abilityCooldown}s` : 'SKILL'}
                  </span>
                </button>

                {/* Jump Button */}
                <button
                  onClick={() => gameEngineRef.current?.jump()}
                  className="w-14 h-14 rounded-2xl bg-slate-900/90 border border-slate-700 text-white flex items-center justify-center active:scale-90 transition shadow-lg font-bold"
                >
                  JUMP
                </button>

                {/* Big FIRE Button */}
                <button
                  onClick={() => gameEngineRef.current?.fireWeapon()}
                  className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 border-2 border-white/60 text-white flex flex-col items-center justify-center active:scale-90 transition shadow-[0_0_30px_rgba(255,70,85,0.9)]"
                >
                  <Crosshair className="w-7 h-7" />
                  <span className="text-[11px] font-black tracking-wider uppercase mt-1">FIRE</span>
                </button>
              </div>

            </div>

          </div>

          {/* Escape / Surrender in corner */}
          <button
            onClick={() => {
              if (gameEngineRef.current) {
                gameEngineRef.current.destroy();
                gameEngineRef.current = null;
              }
              soundManager.playBGM();
              setScreen('lobby');
            }}
            className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-black/50 border border-slate-800 text-[10px] text-slate-400 hover:text-white"
          >
            ম্যাচ ত্যাগ করুন (EXIT)
          </button>
        </div>
      )}

      {/* 6. VICTORY (BOOYAH!) SCREEN */}
      {screen === 'victory' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-slate-950/95 cyber-grid animate-fade-in">
          <div className="text-center max-w-md w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold mb-4 animate-bounce">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>রোহান্স গেম চ্যাম্পিয়ন</span>
            </div>

            <h1 className="text-6xl sm:text-7xl font-black text-transparent bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text drop-shadow-[0_0_40px_rgba(245,158,11,1)] font-sans">
              BOOYAH!
            </h1>
            <p className="text-sm font-bold text-slate-300 mt-2">
              আপনি সিটাডেলের ময়দানে বিজয়ী হয়েছেন!
            </p>

            <div className="my-6 p-4 rounded-2xl bg-slate-900 border border-slate-800 flex justify-around">
              <div>
                <span className="text-xs text-slate-400 block">কয়েন প্রাপ্তি</span>
                <span className="text-lg font-black text-yellow-400 font-orbitron">+৩৫০</span>
              </div>
              <div className="border-r border-slate-800" />
              <div>
                <span className="text-xs text-slate-400 block">ডায়মন্ড প্রাপ্তি</span>
                <span className="text-lg font-black text-cyan-400 font-orbitron">+২৫</span>
              </div>
              <div className="border-r border-slate-800" />
              <div>
                <span className="text-xs text-slate-400 block">র‍্যাংক পয়েন্ট</span>
                <span className="text-lg font-black text-emerald-400 font-orbitron">+৪৫ PTS</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  soundManager.play('ui_matchmaking_start');
                  startBattle();
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(255,70,85,0.6)]"
              >
                আবার খেলুন (PLAY AGAIN)
              </button>

              <button
                onClick={() => {
                  soundManager.playBGM();
                  setScreen('lobby');
                }}
                className="flex-1 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-white font-bold text-sm"
              >
                লবিতে ফিরুন (LOBBY)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. DEFEAT SCREEN */}
      {screen === 'defeat' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-slate-950/95 cyber-grid animate-fade-in">
          <div className="text-center max-w-md w-full">
            <h1 className="text-6xl font-black text-red-500 drop-shadow-[0_0_35px_rgba(239,68,68,0.8)] font-sans">
              DEFEAT
            </h1>
            <p className="text-sm text-slate-400 mt-2 mb-6">
              ভিলেনের হাতে পরাস্ত! পরের রাউন্ডে ঘুরে দাঁড়ান!
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  soundManager.play('ui_matchmaking_start');
                  startBattle();
                }}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(239,68,68,0.5)]"
              >
                আবার চেষ্টা করুন
              </button>

              <button
                onClick={() => {
                  soundManager.playBGM();
                  setScreen('lobby');
                }}
                className="flex-1 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm"
              >
                লবিতে ফিরুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {activeModal === 'jukebox' && (
        <AudioJukeboxModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'spin' && (
        <LuckySpinModal
          userCoins={stats.coins}
          userDiamonds={stats.diamonds}
          onRewardWon={handleRewardWon}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'store' && (
        <StoreModal
          userCoins={stats.coins}
          userDiamonds={stats.diamonds}
          selectedWeapon={selectedWeapon}
          selectedCharacter={selectedCharacter}
          onSelectWeapon={(w) => setSelectedWeapon(w)}
          onSelectCharacter={(c) => setSelectedCharacter(c)}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'missions' && (
        <MissionsModal
          missions={missions}
          onClaimReward={handleClaimMission}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'profile' && (
        <ProfileModal
          stats={stats}
          character={selectedCharacter}
          onClose={() => setActiveModal(null)}
        />
      )}

    </div>
  );
}
