import { Character, Weapon, Mission, SpinReward } from '../types/game';

export const CHARACTERS: Character[] = [
  {
    id: 'freak22',
    name: 'Freak 22',
    title: 'সাইবার ওয়ারিয়র (The Cyber Vanguard)',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&auto=format&fit=crop&q=80',
    role: 'hero',
    color: '#ef4444',
    accentColor: '#f97316',
    health: 200,
    maxHealth: 200,
    speed: 1.15,
    damageMultiplier: 1.1,
    voiceLines: {
      intro: 'player_reply',
      attack: ['player_damage_enemy'],
      damaged: 'snd_player_damaged',
      kill: 'snd_win_round',
      reply: 'player_reply'
    },
    specialAbility: {
      name: 'ড্রাগন অভারড্রাইভ (Dragon Overdrive)',
      description: '৮ সেকেন্ডের জন্য গতি ৫০% বৃদ্ধি এবং প্রতিটি বুলেটে এক্সপ্লোসিভ ড্যামেজ।',
      cooldown: 18,
      icon: 'Flame'
    }
  },
  {
    id: 'raad_vai',
    name: 'Raad Vai YT',
    title: 'সিটাডেল টাইটান (Citadel Rival)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
    role: 'villain',
    color: '#a855f7',
    accentColor: '#ec4899',
    health: 220,
    maxHealth: 220,
    speed: 1.1,
    damageMultiplier: 1.15,
    voiceLines: {
      intro: 'villain_win',
      attack: ['villain_damage'],
      damaged: 'snd_player_damaged',
      kill: 'villain_win',
      reply: 'villain_damage'
    },
    specialAbility: {
      name: 'শ্যাডো শিল্ড (Void Shield)',
      description: '১০০ পয়েন্টের ব্লু শিল্ড যা ইনকামিং ড্যামেজ সম্পূর্ণ ব্লক করে।',
      cooldown: 20,
      icon: 'Shield'
    }
  },
  {
    id: 'kurul_gaming',
    name: 'Kurul Gaming',
    title: 'প্রো স্ট্রিমার মাস্টার (Pro Streamer)',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&auto=format&fit=crop&q=80',
    role: 'ally',
    color: '#3b82f6',
    accentColor: '#06b6d4',
    health: 190,
    maxHealth: 190,
    speed: 1.25,
    damageMultiplier: 1.2,
    voiceLines: {
      intro: 'krull_voice_1',
      attack: ['krull_voice_2'],
      damaged: 'snd_player_damaged',
      kill: 'krull_voice_3',
      reply: 'krull_voice_1'
    },
    specialAbility: {
      name: 'লাইভস্ট্রিম স্নাইপ (One-Tap Sniper)',
      description: 'পরবর্তী ৩টি শটে ১০০% নিখুঁত হেডশট ও ডাবল ড্যামেজ।',
      cooldown: 15,
      icon: 'Crosshair'
    }
  },
  {
    id: 'blade_boss',
    name: 'Blade Boss Titan',
    title: 'সিটাডেল সম্রাট (Dark Emperor Raid Boss)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    role: 'boss',
    color: '#f59e0b',
    accentColor: '#dc2626',
    health: 500,
    maxHealth: 500,
    speed: 0.95,
    damageMultiplier: 1.5,
    voiceLines: {
      intro: 'blade_boss_intro',
      attack: ['blade_boss_voice_1', 'blade_boss_voice_2', 'blade_boss_voice_3'],
      damaged: 'blade_boss_voice_2',
      kill: 'blade_boss_intro',
      reply: 'blade_boss_voice_3'
    },
    specialAbility: {
      name: 'ব্লেড স্টর্ম (Blade Whirlwind)',
      description: 'চারপাশে ঘূর্ণায়মান লেজার ব্লেড রিলিজ করে বিশাল এলাকা জুড়ে ক্ষতিসাধন।',
      cooldown: 25,
      icon: 'Sword'
    }
  },
  {
    id: 'kuttush_pet',
    name: 'Kuttush (কুট্টুস)',
    title: 'ডিভাইন পেট কমরেড (Cyber Pet Companion)',
    avatar: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&auto=format&fit=crop&q=80',
    role: 'ally',
    color: '#10b981',
    accentColor: '#34d399',
    health: 100,
    maxHealth: 100,
    speed: 1.4,
    damageMultiplier: 0.8,
    voiceLines: {
      intro: 'kuttush_intro',
      attack: ['kuttush_damage'],
      damaged: 'kuttush_damage',
      kill: 'kuttush_random',
      reply: 'kuttush_random'
    },
    specialAbility: {
      name: 'কুট্টুস হিলিং অরা (Pet Healing Aura)',
      description: 'প্লেয়ারের প্রতি সেকেন্ডে ২০ HP পুনরুদ্ধার এবং এনিমিকে কামড় দিয়ে ধীরগতির করে।',
      cooldown: 12,
      icon: 'Heart'
    }
  }
];

export const WEAPONS: Weapon[] = [
  {
    id: 'ak47_dragon',
    name: 'AK-47 Dragon Flame',
    type: 'AR',
    rarity: 'Evolution',
    damage: 44,
    fireRate: 11,
    magazine: 35,
    reloadTime: 2.1,
    recoil: 0.22,
    perk: 'ফায়ার রেট +২৫% ও ড্রাগন বার্ন এফেক্ট',
    color: '#ff4655',
    icon: 'Flame'
  },
  {
    id: 'mp40_cobra',
    name: 'MP40 Venom Cobra',
    type: 'SMG',
    rarity: 'Mythic',
    damage: 28,
    fireRate: 17,
    magazine: 40,
    reloadTime: 1.7,
    recoil: 0.15,
    perk: 'ক্লোজ রেঞ্জে ডাবল ড্যামেজ স্প্রে',
    color: '#eab308',
    icon: 'Zap'
  },
  {
    id: 'm1887_punch',
    name: 'M1887 One-Punch',
    type: 'Shotgun',
    rarity: 'Evolution',
    damage: 115,
    fireRate: 2.3,
    magazine: 2,
    reloadTime: 1.4,
    recoil: 0.45,
    perk: 'এক শটে এনিমি ডিফেন্স ধ্বংস',
    color: '#ec4899',
    icon: 'Target'
  },
  {
    id: 'awm_god',
    name: 'AWM Cyber God',
    type: 'Sniper',
    rarity: 'Mythic',
    damage: 160,
    fireRate: 1.2,
    magazine: 5,
    reloadTime: 2.8,
    recoil: 0.5,
    perk: 'দূরপাল্লায় নিশ্চিত ওয়ান-ট্যাপ হেডশট',
    color: '#06b6d4',
    icon: 'Crosshair'
  },
  {
    id: 'katana_blood',
    name: 'Katana Bloodlust Blade',
    type: 'Melee',
    rarity: 'Epic',
    damage: 85,
    fireRate: 3.5,
    magazine: 999,
    reloadTime: 0,
    recoil: 0,
    perk: 'বুলেট ডিফ্লেক্ট ও ড্রিম স্ল্যাশ',
    color: '#8b5cf6',
    icon: 'Sword'
  }
];

export const MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'প্রথম রক্তের অভিযান',
    description: 'যে কোনো ব্যাটেলে ১ জন এনিমিকে নকআউট করুন।',
    progress: 1,
    target: 1,
    rewardDiamonds: 50,
    rewardCoins: 500,
    completed: true,
    claimed: false
  },
  {
    id: 'm2',
    title: 'ভিলেনের মুখ বন্ধ করো!',
    description: 'Raad Vai YT কে পরাজিত করে বুইয়া ছিনিয়ে নিন।',
    progress: 0,
    target: 1,
    rewardDiamonds: 100,
    rewardCoins: 1200,
    completed: false,
    claimed: false
  },
  {
    id: 'm3',
    title: 'ব্লেড বস রেড চ্যাম্পিয়ন',
    description: 'Blade Boss Titan কে পরাজিত করে সিটাডেল মুক্ত করুন।',
    progress: 0,
    target: 1,
    rewardDiamonds: 250,
    rewardCoins: 3000,
    completed: false,
    claimed: false
  },
  {
    id: 'm4',
    title: 'হেডশট স্পেশালিস্ট',
    description: 'যেকোনো ম্যাচে ৩টি হেডশট হিট স্কোর করুন।',
    progress: 2,
    target: 3,
    rewardDiamonds: 80,
    rewardCoins: 800,
    completed: false,
    claimed: false
  }
];

export const SPIN_REWARDS: SpinReward[] = [
  { id: 'sr1', name: '১০০ ডায়মন্ড', type: 'diamonds', amount: 100, rarity: 'Rare', color: '#06b6d4', icon: 'Diamond' },
  { id: 'sr2', name: 'AK-47 ড্রাগন স্কিন', type: 'weapon', rarity: 'Mythic', color: '#ff4655', icon: 'Flame' },
  { id: 'sr3', name: '১,০০০ কয়েন', type: 'coins', amount: 1000, rarity: 'Common', color: '#eab308', icon: 'Coins' },
  { id: 'sr4', name: 'কুট্টুস পেট প্রিমিয়াম', type: 'character', rarity: 'Legendary', color: '#10b981', icon: 'Heart' },
  { id: 'sr5', name: '৫০০ ডায়মন্ড জ্যাকপট', type: 'diamonds', amount: 500, rarity: 'Mythic', color: '#a855f7', icon: 'Sparkles' },
  { id: 'sr6', name: 'MP40 কোবরা স্কিন', type: 'weapon', rarity: 'Legendary', color: '#f59e0b', icon: 'Zap' },
  { id: 'sr7', name: '২,৫০০ কয়েন', type: 'coins', amount: 2500, rarity: 'Common', color: '#eab308', icon: 'Coins' },
  { id: 'sr8', name: 'ব্লেড বস টাইটান কস্টিউম', type: 'character', rarity: 'Mythic', color: '#dc2626', icon: 'Shield' }
];
