/**
 * Sound Manager for Rohan's Game (রোহান্স গেম)
 * Free Fire: Cyber Citadel Edition
 * Contains all Bengali voice lines, boss lines, combat SFX, and UI audio.
 */

export interface AudioItem {
  id: string;
  name: string;
  bengaliName: string;
  category: 'voice' | 'sfx' | 'music' | 'boss';
  url: string;
  subtitles?: string;
}

export const AUDIO_CATALOG: Record<string, AudioItem> = {
  // Voice lines & Dialogue
  villain_win: {
    id: 'villain_win',
    name: 'Villain Victory',
    bengaliName: 'ভিলেন জিতলে বলবে',
    category: 'voice',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/villain_jitle_bolbe_8c99d7d9.mp3',
    subtitles: 'হাহাহা! তোরা আমার সামনে বাচ্চা! ময়দানে কেউ দাঁড়াতে পারবি না!'
  },
  villain_damage: {
    id: 'villain_damage',
    name: 'Villain Damage Attack',
    bengaliName: 'ভিলেন ড্যামেজ দিলে বলবে',
    category: 'voice',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/judivillainamake_damage_dey_tahole_villain_eita_bolbe_f4619d22.mp3',
    subtitles: 'খা এবার ড্যামেজ! তোকে উড়িয়ে দেব এক নিমেষে!'
  },
  player_reply: {
    id: 'player_reply',
    name: 'Hero Reply to Villain',
    bengaliName: 'ভিলেনের ড্যামেজের জবাব',
    category: 'voice',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/villaindamage_diye_jeita_bolbe_oitar_reply_dibe_eita_db0bcaf0.mp3',
    subtitles: 'এত সহজে হার মানবো না! এইবার আমার পালা, দেখ!'
  },
  player_damage_enemy: {
    id: 'player_damage_enemy',
    name: 'Player Damaging Enemy',
    bengaliName: 'এনিমিকে ড্যামেজ দেওয়া সংলাপ',
    category: 'voice',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/judi_ami_emine_ke_Damage_dei_0585fb43.mp3',
    subtitles: 'হেডশট! পালাবি কোথায়? খেলা তো মাত্র শুরু!'
  },
  snd_player_damaged: {
    id: 'snd_player_damaged',
    name: 'Player Hurt',
    bengaliName: 'প্লেয়ার ড্যামেজ সাউন্ড',
    category: 'voice',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/snd_player_damaged_f7166285.mp3',
    subtitles: 'উফ! লেগেছে, কিন্তু এখনো দাঁড়িয়ে আছি!'
  },
  snd_player_defeat: {
    id: 'snd_player_defeat',
    name: 'Player Defeated',
    bengaliName: 'প্লেয়ার পরাস্ত',
    category: 'voice',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/snd_player_defeat_f97e232b.mp3',
    subtitles: 'পরের রাউন্ডে তোকে দেখে নেব!'
  },
  snd_win_round: {
    id: 'snd_win_round',
    name: 'Round Win',
    bengaliName: 'রাউন্ড জয় আনন্দধ্বনি',
    category: 'voice',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/snd_win_round_f814c3c2.mp3',
    subtitles: 'ইয়েস! রাউন্ড আমাদের! রোহান্স গেম রুলস!'
  },
  snd_meme_banter_1: {
    id: 'snd_meme_banter_1',
    name: 'Meme Banter Fun',
    bengaliName: 'মিম ফান ব্যাণ্টার',
    category: 'voice',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/snd_meme_banter_1_498a989c.mp3',
    subtitles: 'ওরে ভাইরে ভাই! এ কি মারল রে বাবা!'
  },

  // Kurul Gaming Voice lines
  krull_voice_1: {
    id: 'krull_voice_1',
    name: 'Kurul Streamer Banter 1',
    bengaliName: 'কুরুল গেমিং সংলাপ ১',
    category: 'voice',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/krull_gaming_voice_1_39205443.mp3',
    subtitles: 'লাইভ স্ট্রিমে সবাইকে স্বাগতম! আজ পুরো লবি খালি হবে!'
  },
  krull_voice_2: {
    id: 'krull_voice_2',
    name: 'Kurul Streamer Banter 2',
    bengaliName: 'কুরুল গেমিং সংলাপ ২',
    category: 'voice',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/krull_gaming_voice_2_0425bff4.mp3',
    subtitles: 'কোপ হবে ভাই! এক শটে ওয়ান ট্যাপ!'
  },
  krull_voice_3: {
    id: 'krull_voice_3',
    name: 'Kurul Streamer Banter 3',
    bengaliName: 'কুরুল গেমিং সংলাপ ৩',
    category: 'voice',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/kurul_gaming_voice_3.mp3',
    subtitles: 'লাইক ও সাবস্ক্রাইব করে দাও! বুইয়া আমাদেরই!'
  },

  // Blade Boss lines
  blade_boss_intro: {
    id: 'blade_boss_intro',
    name: 'Blade Boss Entrance',
    bengaliName: 'ব্লেড বসের প্রবেশ সংকেত',
    category: 'boss',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/blade_boss_intro.mp3',
    subtitles: 'আমি সাইবার সিটাডেলের অন্ধকার সম্রাট! তোদের মৃত্যু নিশ্চিত!'
  },
  blade_boss_voice_1: {
    id: 'blade_boss_voice_1',
    name: 'Blade Boss Attack 1',
    bengaliName: 'ব্লেড বস অ্যাটাক ১',
    category: 'boss',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/blade_boss_voice_1.mp3',
    subtitles: 'সাইবার ব্লেড স্ট্রাইক! পুড়ে ছাই হয়ে যা!'
  },
  blade_boss_voice_2: {
    id: 'blade_boss_voice_2',
    name: 'Blade Boss Attack 2',
    bengaliName: 'ব্লেড বস অ্যাটাক ২',
    category: 'boss',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/blade_boss_voice_2.mp3',
    subtitles: 'কেউ আমার ব্লেড থেকে বাঁচতে পারবে না!'
  },
  blade_boss_voice_3: {
    id: 'blade_boss_voice_3',
    name: 'Blade Boss Rage Fury',
    bengaliName: 'ব্লেড বস ক্রোধ ৩',
    category: 'boss',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/blade_boss_voice_3.mp3',
    subtitles: 'অনন্ত অন্ধকার তোদের গ্রাস করবে!'
  },

  // Kuttush Pet companion lines
  kuttush_intro: {
    id: 'kuttush_intro',
    name: 'Kuttush Pet Intro',
    bengaliName: 'কুট্টুস পেট আবির্ভাব',
    category: 'voice',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/kuttush_intro.mp3',
    subtitles: 'কুউউ! কুট্টুস প্রস্তুত তোমার সাথে ফাইট করতে!'
  },
  kuttush_damage: {
    id: 'kuttush_damage',
    name: 'Kuttush Attack Assist',
    bengaliName: 'কুট্টুস পেট অ্যাটাক',
    category: 'voice',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/kuttush_damage.mp3',
    subtitles: 'কুট্টুস বাইট! এনিমি ড্যামেজড!'
  },
  kuttush_random: {
    id: 'kuttush_random',
    name: 'Kuttush Happy Sound',
    bengaliName: 'কুট্টুস আনন্দ ডাক',
    category: 'voice',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/kuttush_random.mp3',
    subtitles: 'কুউউ-উউউ! আমরা জিতে যাচ্ছি!'
  },

  // UI Sound Effects
  ui_store_open: {
    id: 'ui_store_open',
    name: 'Store Open',
    bengaliName: 'স্টোর খোলার শব্দ',
    category: 'sfx',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/sfx/ui_store_open.mp3'
  },
  ui_close_back: {
    id: 'ui_close_back',
    name: 'Back / Close',
    bengaliName: 'ব্যাক বাটন সাউন্ড',
    category: 'sfx',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/sfx/ui_close_back.mp3'
  },
  ui_click_tap: {
    id: 'ui_click_tap',
    name: 'UI Click Tap',
    bengaliName: 'বাটন ক্লিক সাউন্ড',
    category: 'sfx',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/sfx/ui_click_tap.mp3'
  },
  ui_item_tap: {
    id: 'ui_item_tap',
    name: 'Item Select',
    bengaliName: 'আইটেম নির্বাচন সাউন্ড',
    category: 'sfx',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/sfx/ui_item_tap.mp3'
  },
  ui_purchase_confirm: {
    id: 'ui_purchase_confirm',
    name: 'Purchase Confirm',
    bengaliName: 'ক্রয় নিশ্চিতকরণ সাউন্ড',
    category: 'sfx',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/sfx/ui_purchase_confirm.mp3'
  },
  ui_congratulations: {
    id: 'ui_congratulations',
    name: 'Congratulations Normal',
    bengaliName: 'অভিনন্দন সুর',
    category: 'sfx',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/sfx/ui_congratulations.mp3'
  },
  ui_congratulations_rare: {
    id: 'ui_congratulations_rare',
    name: 'Congratulations Rare',
    bengaliName: 'রেয়ার আইটেম অভিনন্দন',
    category: 'sfx',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/sfx/ui_congratulations_rare.mp3'
  },
  ui_claim_coin: {
    id: 'ui_claim_coin',
    name: 'Claim Coin / Diamond',
    bengaliName: 'কয়েন সংগ্রহ সাউন্ড',
    category: 'sfx',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/sfx/ui_claim_coin.mp3'
  },
  ui_profile_open: {
    id: 'ui_profile_open',
    name: 'Profile Open',
    bengaliName: 'প্রোফাইল ওপেন সাউন্ড',
    category: 'sfx',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/sfx/ui_profile_open.mp3'
  },
  ui_missions_open: {
    id: 'ui_missions_open',
    name: 'Missions Open',
    bengaliName: 'মিশন মেনু সাউন্ড',
    category: 'sfx',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/sfx/ui_missions_open.mp3'
  },
  ui_mode_drawer_open: {
    id: 'ui_mode_drawer_open',
    name: 'Mode Select Open',
    bengaliName: 'মোড মেনু সাউন্ড',
    category: 'sfx',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/sfx/ui_mode_drawer_open.mp3'
  },
  ui_mode_select: {
    id: 'ui_mode_select',
    name: 'Mode Confirmed',
    bengaliName: 'মোড নির্বাচন সাউন্ড',
    category: 'sfx',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/sfx/ui_mode_select.mp3'
  },
  ui_matchmaking_start: {
    id: 'ui_matchmaking_start',
    name: 'Matchmaking Start',
    bengaliName: 'ম্যাচমেকিং শুরু সাইরেন',
    category: 'sfx',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/sfx/ui_matchmaking_start.mp3'
  },
  ui_matchmaking_cancel: {
    id: 'ui_matchmaking_cancel',
    name: 'Matchmaking Cancel',
    bengaliName: 'ম্যাচমেকিং বাতিল সাউন্ড',
    category: 'sfx',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/sfx/ui_matchmaking_cancel.mp3'
  },
  booyah_victory: {
    id: 'booyah_victory',
    name: 'BOOYAH Victory Fanfare',
    bengaliName: 'বুইয়া বিজয় সংগীত',
    category: 'music',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/sfx/booyah_victory.mp3',
    subtitles: 'BOOYAH! রোহান্স গেম বিজয়ী চ্যাম্পিয়ন!'
  },
  login_enter_game: {
    id: 'login_enter_game',
    name: 'Login Enter Game',
    bengaliName: 'গেমে প্রবেশ প্রভাব',
    category: 'sfx',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/sfx/login_enter_game.mp3'
  },
  company_logo: {
    id: 'company_logo',
    name: 'Company Studio Logo Intro',
    bengaliName: 'রোহান্স গেম স্টুডিও লোগো সুর',
    category: 'sfx',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/sfx/company_logo.mp3'
  },
  ff_winterland_theme: {
    id: 'ff_winterland_theme',
    name: 'Cyber Winterland Lobby Theme',
    bengaliName: 'লবি ব্যাকগ্রাউন্ড মিউজিক (Winterland)',
    category: 'music',
    url: 'https://freak22-vs-raad-vai-yt.ai.studio/assets/aistudio/ff_winterland_theme.mp3?v=instant2'
  }
};

type SubtitleListener = (text: string | null) => void;

class SoundManager {
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private audioCtx: AudioContext | null = null;
  private bgmAudio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.85;
  private sfxVolume: number = 0.9;
  private voiceVolume: number = 1.0;
  private bgmVolume: number = 0.55;
  private subtitleListeners: Set<SubtitleListener> = new Set();
  private subtitleTimeout: any = null;

  constructor() {
    // Lazy initialize on first user gesture
  }

  private initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public subscribeSubtitles(callback: SubtitleListener): () => void {
    this.subtitleListeners.add(callback);
    return () => {
      this.subtitleListeners.delete(callback);
    };
  }

  private emitSubtitle(text: string) {
    if (this.subtitleTimeout) {
      clearTimeout(this.subtitleTimeout);
    }
    this.subtitleListeners.forEach(cb => cb(text));
    this.subtitleTimeout = setTimeout(() => {
      this.subtitleListeners.forEach(cb => cb(null));
    }, 4000);
  }

  public play(id: string, options?: { volume?: number; loop?: boolean }) {
    if (this.isMuted) return;
    this.initAudioContext();

    const item = AUDIO_CATALOG[id];
    if (item && item.subtitles) {
      this.emitSubtitle(item.subtitles);
    }

    if (!item) {
      // Play synthetic fallback if ID not found
      this.playSynthetic(id);
      return;
    }

    let audio = this.audioElements.get(id);
    if (!audio) {
      audio = new Audio(item.url);
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      this.audioElements.set(id, audio);
    }

    // Set volume category
    let finalVol = this.volume;
    if (item.category === 'voice' || item.category === 'boss') {
      finalVol *= this.voiceVolume;
    } else if (item.category === 'sfx') {
      finalVol *= this.sfxVolume;
    } else if (item.category === 'music') {
      finalVol *= this.bgmVolume;
    }

    if (options?.volume !== undefined) {
      finalVol = options.volume;
    }

    audio.volume = Math.min(1, Math.max(0, finalVol));
    audio.loop = !!options?.loop;
    audio.currentTime = 0;

    const playPromise = audio.play();
    if (playPromise) {
      playPromise.catch((_err) => {
        // Fallback to web audio synthesis if browser blocks or fails to fetch
        this.playSynthetic(id);
      });
    }
  }

  public playBGM(urlOrId: string = 'ff_winterland_theme') {
    if (this.isMuted) return;
    this.initAudioContext();

    const targetUrl = AUDIO_CATALOG[urlOrId]?.url || urlOrId;

    if (this.bgmAudio) {
      if (this.bgmAudio.src.includes(targetUrl) && !this.bgmAudio.paused) {
        return;
      }
      this.bgmAudio.pause();
    }

    this.bgmAudio = new Audio(targetUrl);
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = this.bgmVolume * this.volume;
    this.bgmAudio.crossOrigin = 'anonymous';
    this.bgmAudio.play().catch(() => {
      // User hasn't interacted yet; will resume upon first click
    });
  }

  public stopBGM() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.bgmAudio) {
      this.bgmAudio.muted = this.isMuted;
    }
    this.audioElements.forEach(aud => {
      aud.muted = this.isMuted;
    });
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.bgmVolume * this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Web Audio API synthesized sound generator as seamless fallback
   */
  public playSynthetic(type: string) {
    if (this.isMuted) return;
    try {
      this.initAudioContext();
      if (!this.audioCtx) return;

      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      if (type.includes('click') || type.includes('tap') || type.includes('item')) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
        gain.gain.setValueAtTime(0.15 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type.includes('damage') || type.includes('hurt')) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);
        gain.gain.setValueAtTime(0.3 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type.includes('win') || type.includes('booyah') || type.includes('congratulations')) {
        // High energy chime chord
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.2 * this.volume, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8 + idx * 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + 0.9 + idx * 0.1);
        });
      } else if (type.includes('shoot') || type.includes('fire')) {
        const bufferSize = ctx.sampleRate * 0.15;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.15);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.25 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
      } else if (type.includes('logo') || type.includes('intro')) {
        // Futuristic whoosh & cinematic boom
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 1.2);
        gain.gain.setValueAtTime(0.4 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.2);
      }
    } catch {
      // Ignore audio synthesis errors on locked browsers
    }
  }
}

export const soundManager = new SoundManager();
