export interface Character {
  id: string;
  name: string;
  title: string;
  avatar: string;
  role: 'hero' | 'villain' | 'boss' | 'ally';
  color: string;
  accentColor: string;
  health: number;
  maxHealth: number;
  speed: number;
  damageMultiplier: number;
  voiceLines: {
    intro?: string;
    attack?: string[];
    damaged?: string;
    kill?: string;
    reply?: string;
  };
  specialAbility: {
    name: string;
    description: string;
    cooldown: number; // in seconds
    icon: string;
  };
}

export interface Weapon {
  id: string;
  name: string;
  type: 'AR' | 'SMG' | 'Shotgun' | 'Sniper' | 'Melee';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Mythic' | 'Evolution';
  damage: number;
  fireRate: number; // bullets per sec
  magazine: number;
  reloadTime: number; // seconds
  recoil: number;
  perk: string;
  color: string;
  icon: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  rewardDiamonds: number;
  rewardCoins: number;
  completed: boolean;
  claimed: boolean;
}

export interface SpinReward {
  id: string;
  name: string;
  type: 'weapon' | 'character' | 'diamonds' | 'coins' | 'crate';
  amount?: number;
  rarity: 'Common' | 'Rare' | 'Legendary' | 'Mythic';
  color: string;
  icon: string;
}

export type GameScreen = 
  | 'intro_rohan'       // Rohan's Game Intro animation
  | 'loading'           // Loading and asset initialization
  | 'login'             // Game login / enter
  | 'lobby'             // Main cyber lobby
  | 'matchmaking'       // Matchmaking radar screen
  | 'battle'            // 3D arena battle
  | 'victory'           // Booyah! Victory screen
  | 'defeat';           // Defeat screen

export type GameMode = 'solo_1v1' | 'boss_raid' | 'ranked_citadel' | 'voice_brawl';

export interface PlayerStats {
  level: number;
  exp: number;
  maxExp: number;
  coins: number;
  diamonds: number;
  rank: string;
  rankPoints: number;
  wins: number;
  matches: number;
  kills: number;
  headshotRate: number;
}
