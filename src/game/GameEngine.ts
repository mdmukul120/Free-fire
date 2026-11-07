import * as THREE from 'three';
import { soundManager } from '../audio/soundManager';
import { Character, Weapon } from '../types/game';

export interface BattleEventCallbacks {
  onPlayerHealthChange: (hp: number, maxHp: number) => void;
  onEnemyHealthChange: (hp: number, maxHp: number) => void;
  onAmmoChange: (current: number, max: number) => void;
  onScoreChange: (kills: number, headshots: number) => void;
  onDialogue: (text: string, speaker: string, color: string) => void;
  onBattleEnd: (won: boolean) => void;
}

export class GameEngine {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animationFrameId: number | null = null;
  private clock: THREE.Clock;

  // Game state
  private playerCharacter: Character;
  private enemyCharacter: Character;
  private currentWeapon: Weapon;
  private callbacks: BattleEventCallbacks;

  private playerHp: number = 200;
  private playerMaxHp: number = 200;
  private enemyHp: number = 200;
  private enemyMaxHp: number = 200;
  private currentAmmo: number = 35;
  private maxAmmo: number = 35;
  private kills: number = 0;
  private headshots: number = 0;
  private isGameOver: boolean = false;
  private isReloading: boolean = false;

  // 3D Objects
  private playerGroup: THREE.Group;
  private enemyGroup: THREE.Group;
  private arenaGroup: THREE.Group;
  private bullets: { mesh: THREE.Mesh; direction: THREE.Vector3; speed: number; isPlayer: boolean; life: number }[] = [];
  private floatingTexts: { element: HTMLDivElement; pos: THREE.Vector3; life: number }[] = [];
  private particles: THREE.Points | null = null;

  // Controls & Physics
  private keys: Record<string, boolean> = {};
  private joystickMove = { x: 0, y: 0 };
  private playerVelocity = new THREE.Vector3();
  private isJumping: boolean = false;
  private cameraRotation = { pitch: 0, yaw: 0 };
  private isAiming: boolean = false;

  // Timers
  private enemyAttackTimer: number = 0;
  private lastDialogueTime: number = 0;

  constructor(
    container: HTMLElement,
    player: Character,
    enemy: Character,
    weapon: Weapon,
    callbacks: BattleEventCallbacks
  ) {
    this.container = container;
    this.playerCharacter = player;
    this.enemyCharacter = enemy;
    this.currentWeapon = weapon;
    this.callbacks = callbacks;

    this.playerHp = player.health;
    this.playerMaxHp = player.maxHealth;
    this.enemyHp = enemy.health;
    this.enemyMaxHp = enemy.maxHealth;
    this.currentAmmo = weapon.magazine;
    this.maxAmmo = weapon.magazine;

    this.clock = new THREE.Clock();

    // Init Three.js Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060814);
    this.scene.fog = new THREE.FogExp2(0x0a0c1a, 0.022);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    this.playerGroup = new THREE.Group();
    this.enemyGroup = new THREE.Group();
    this.arenaGroup = new THREE.Group();

    this.scene.add(this.playerGroup);
    this.scene.add(this.enemyGroup);
    this.scene.add(this.arenaGroup);

    this.setupLights();
    this.buildCyberArena();
    this.buildPlayerModel();
    this.buildEnemyModel();
    this.setupParticles();

    this.initEventListeners();

    // Trigger starting intro voice line
    setTimeout(() => {
      if (this.enemyCharacter.role === 'boss') {
        soundManager.play('blade_boss_intro');
        this.callbacks.onDialogue('ব্লেড বস সিটাডেলের অন্ধকার জাগ্রত করেছে!', 'Blade Boss', '#f59e0b');
      } else {
        soundManager.play('snd_meme_banter_1');
        this.callbacks.onDialogue('ম্যাচ শুরু! দেখাও তোমার রোহান্স গেম স্কিল!', 'Announcer', '#ff4655');
      }
    }, 600);

    this.animate();
  }

  private setupLights() {
    const ambientLight = new THREE.AmbientLight(0x223355, 1.2);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.0);
    mainLight.position.set(20, 45, 20);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    this.scene.add(mainLight);

    // Dynamic red and cyan cyber spotlights
    const redSpot = new THREE.PointLight(0xff3344, 3, 40);
    redSpot.position.set(-15, 12, -15);
    this.scene.add(redSpot);

    const cyanSpot = new THREE.PointLight(0x00f0ff, 3, 40);
    cyanSpot.position.set(15, 12, 15);
    this.scene.add(cyanSpot);
  }

  private buildCyberArena() {
    // Cyber arena floor with grid lines
    const floorGeo = new THREE.PlaneGeometry(80, 80, 32, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x080c18,
      roughness: 0.2,
      metalness: 0.8
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.arenaGroup.add(floor);

    // Glowing grid lines overlay
    const grid = new THREE.GridHelper(80, 40, 0xff4655, 0x1f293d);
    grid.position.y = 0.02;
    this.arenaGroup.add(grid);

    // Central glowing energy core
    const coreGeo = new THREE.CylinderGeometry(4, 5, 1.5, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.9,
      roughness: 0.1
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 0.75;
    this.arenaGroup.add(core);

    const ringGeo = new THREE.TorusGeometry(3.2, 0.25, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff4655 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1.55;
    this.arenaGroup.add(ring);

    // 4 Neon pillars with energy barriers
    const pillarPositions = [
      [-18, -18],
      [18, -18],
      [-18, 18],
      [18, 18]
    ];

    pillarPositions.forEach(([px, pz]) => {
      const pillarGeo = new THREE.BoxGeometry(3, 14, 3);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.7,
        roughness: 0.2
      });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(px, 7, pz);
      pillar.castShadow = true;
      this.arenaGroup.add(pillar);

      // Neon strips
      const stripGeo = new THREE.BoxGeometry(3.1, 12, 0.4);
      const stripMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      const strip = new THREE.Mesh(stripGeo, stripMat);
      strip.position.set(px, 7, pz);
      this.arenaGroup.add(strip);
    });

    // Outer cyber barriers
    const wallGeo = new THREE.BoxGeometry(80, 6, 1);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.5,
      metalness: 0.6
    });

    const w1 = new THREE.Mesh(wallGeo, wallMat);
    w1.position.set(0, 3, -40);
    const w2 = new THREE.Mesh(wallGeo, wallMat);
    w2.position.set(0, 3, 40);
    const w3 = new THREE.Mesh(wallGeo, wallMat);
    w3.rotation.y = Math.PI / 2;
    w3.position.set(-40, 3, 0);
    const w4 = new THREE.Mesh(wallGeo, wallMat);
    w4.rotation.y = Math.PI / 2;
    w4.position.set(40, 3, 0);

    this.arenaGroup.add(w1, w2, w3, w4);
  }

  private buildPlayerModel() {
    // Stylized Cyber Soldier Model
    const colorHex = parseInt(this.playerCharacter.color.replace('#', '0x'), 16);

    // Torso / Armor
    const torsoGeo = new THREE.BoxGeometry(1.2, 1.8, 0.8);
    const torsoMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      metalness: 0.8,
      roughness: 0.2
    });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 2.4;
    torso.castShadow = true;

    // Glowing core reactor
    const coreGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(0, 2.6, 0.45);

    // Head / Cyber Visor
    const headGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 3.8;

    const visorGeo = new THREE.BoxGeometry(0.75, 0.25, 0.2);
    const visorMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 3.8, 0.42);

    // Weapon mesh held in hands
    const gunGeo = new THREE.BoxGeometry(0.3, 0.35, 1.8);
    const gunMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.9,
      roughness: 0.1
    });
    const gun = new THREE.Mesh(gunGeo, gunMat);
    gun.position.set(0.7, 2.3, 1.0);

    const muzzleGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.4);
    const muzzleMat = new THREE.MeshBasicMaterial({ color: 0xff4655 });
    const muzzle = new THREE.Mesh(muzzleGeo, muzzleMat);
    muzzle.rotation.x = Math.PI / 2;
    muzzle.position.set(0.7, 2.3, 2.0);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.45, 1.6, 0.5);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.35, 0.8, 0);

    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(0.35, 0.8, 0);

    this.playerGroup.add(torso, core, head, visor, gun, muzzle, leftLeg, rightLeg);
    this.playerGroup.position.set(0, 0, 15);
  }

  private buildEnemyModel() {
    const colorHex = parseInt(this.enemyCharacter.color.replace('#', '0x'), 16);
    const isBoss = this.enemyCharacter.role === 'boss';
    const scale = isBoss ? 1.7 : 1.0;

    // Enemy Torso
    const torsoGeo = new THREE.BoxGeometry(1.4 * scale, 2.0 * scale, 0.9 * scale);
    const torsoMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      metalness: 0.85,
      roughness: 0.15
    });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 2.4 * scale;
    torso.castShadow = true;

    // Enemy Head
    const headGeo = new THREE.BoxGeometry(0.9 * scale, 0.9 * scale, 0.9 * scale);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x18181b });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 3.9 * scale;

    // Crimson evil visor
    const visorGeo = new THREE.BoxGeometry(0.8 * scale, 0.25 * scale, 0.2 * scale);
    const visorMat = new THREE.MeshBasicMaterial({ color: isBoss ? 0xff0033 : 0xa855f7 });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 3.9 * scale, 0.46 * scale);

    // Boss special twin glowing shoulder spikes / blades
    if (isBoss) {
      const blade1Geo = new THREE.ConeGeometry(0.5, 2.8, 8);
      const bladeMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
      const b1 = new THREE.Mesh(blade1Geo, bladeMat);
      b1.rotation.z = Math.PI / 4;
      b1.position.set(-1.6, 4.0, 0);

      const b2 = new THREE.Mesh(blade1Geo, bladeMat);
      b2.rotation.z = -Math.PI / 4;
      b2.position.set(1.6, 4.0, 0);

      this.enemyGroup.add(b1, b2);
    }

    // Legs
    const legGeo = new THREE.BoxGeometry(0.5 * scale, 1.8 * scale, 0.6 * scale);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x09090b });
    const lLeg = new THREE.Mesh(legGeo, legMat);
    lLeg.position.set(-0.45 * scale, 0.9 * scale, 0);

    const rLeg = new THREE.Mesh(legGeo, legMat);
    rLeg.position.set(0.45 * scale, 0.9 * scale, 0);

    this.enemyGroup.add(torso, head, visor, lLeg, rLeg);
    this.enemyGroup.position.set(0, 0, -18);
  }

  private setupParticles() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 60;
      positions[i + 1] = Math.random() * 20;
      positions[i + 2] = (Math.random() - 0.5) * 60;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xff4655,
      size: 0.25,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private initEventListeners() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('resize', this.handleResize);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keys[e.key.toLowerCase()] = true;

    if (e.code === 'Space') {
      this.jump();
    }
    if (e.key.toLowerCase() === 'r') {
      this.reload();
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.key.toLowerCase()] = false;
  };

  private handleResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  // Joystick Input from Virtual On-Screen Joystick
  public setJoystickInput(x: number, y: number) {
    this.joystickMove = { x, y };
  }

  // Camera look rotation from drag / touch
  public rotateCamera(deltaX: number, deltaY: number) {
    this.cameraRotation.yaw -= deltaX * 0.005;
    this.cameraRotation.pitch -= deltaY * 0.005;
    this.cameraRotation.pitch = Math.max(-0.6, Math.min(0.6, this.cameraRotation.pitch));
  }

  public jump() {
    if (!this.isJumping && this.playerGroup.position.y <= 0.05) {
      this.playerVelocity.y = 8.5;
      this.isJumping = true;
      soundManager.play('ui_mode_select', { volume: 0.4 });
    }
  }

  public reload() {
    if (this.isReloading || this.currentAmmo === this.maxAmmo) return;
    this.isReloading = true;
    soundManager.play('ui_item_tap');
    this.callbacks.onDialogue('রিলোড হচ্ছে...', this.playerCharacter.name, '#38bdf8');

    setTimeout(() => {
      this.currentAmmo = this.maxAmmo;
      this.isReloading = false;
      this.callbacks.onAmmoChange(this.currentAmmo, this.maxAmmo);
    }, this.currentWeapon.reloadTime * 1000);
  }

  public fireWeapon() {
    if (this.isGameOver || this.isReloading) return;

    if (this.currentAmmo <= 0) {
      this.reload();
      return;
    }

    this.currentAmmo--;
    this.callbacks.onAmmoChange(this.currentAmmo, this.maxAmmo);
    soundManager.playSynthetic('fire');

    // Muzzle flash bullet spawn
    const bulletGeo = new THREE.SphereGeometry(0.25, 8, 8);
    const bulletMat = new THREE.MeshBasicMaterial({ color: 0xffdd00 });
    const bulletMesh = new THREE.Mesh(bulletGeo, bulletMat);

    // Calculate bullet trajectory towards enemy or crosshair
    const spawnPos = this.playerGroup.position.clone().add(new THREE.Vector3(0.7, 2.3, 0));
    bulletMesh.position.copy(spawnPos);

    const targetPos = this.enemyGroup.position.clone().add(new THREE.Vector3(0, 2.5, 0));
    // Add tiny recoil spread
    targetPos.x += (Math.random() - 0.5) * this.currentWeapon.recoil * 3;
    targetPos.y += (Math.random() - 0.5) * this.currentWeapon.recoil * 2;

    const dir = targetPos.clone().sub(spawnPos).normalize();

    this.scene.add(bulletMesh);
    this.bullets.push({
      mesh: bulletMesh,
      direction: dir,
      speed: 45,
      isPlayer: true,
      life: 1.5
    });
  }

  public useSpecialAbility() {
    if (this.isGameOver) return;
    soundManager.play('ui_congratulations_rare');
    this.callbacks.onDialogue(
      `${this.playerCharacter.specialAbility.name} সক্রিয় করা হয়েছে!`,
      this.playerCharacter.name,
      '#f59e0b'
    );

    // Heal & boost damage
    this.playerHp = Math.min(this.playerMaxHp, this.playerHp + 50);
    this.callbacks.onPlayerHealthChange(this.playerHp, this.playerMaxHp);

    // Kuttush assist voice
    setTimeout(() => {
      soundManager.play('kuttush_damage');
    }, 400);
  }

  private triggerBengaliDialogue(type: 'player_hit' | 'player_hurt' | 'villain_talk' | 'boss_fury') {
    const now = Date.now();
    if (now - this.lastDialogueTime < 3500) return; // Prevent spam
    this.lastDialogueTime = now;

    if (type === 'player_hit') {
      soundManager.play('player_damage_enemy');
      this.callbacks.onDialogue('হেডশট! পালাবি কোথায়? খেলা তো মাত্র শুরু!', this.playerCharacter.name, '#22c55e');
    } else if (type === 'player_hurt') {
      soundManager.play('villain_damage');
      this.callbacks.onDialogue('খা এবার ড্যামেজ! তোকে উড়িয়ে দেব এক নিমেষে!', this.enemyCharacter.name, '#ef4444');
      // Player counter reply after 1.8s
      setTimeout(() => {
        soundManager.play('player_reply');
        this.callbacks.onDialogue('এত সহজে হার মানবো না! এইবার আমার পালা!', this.playerCharacter.name, '#38bdf8');
      }, 1900);
    } else if (type === 'boss_fury') {
      soundManager.play('blade_boss_voice_1');
      this.callbacks.onDialogue('সাইবার ব্লেড স্ট্রাইক! পুড়ে ছাই হয়ে যা!', 'Blade Boss', '#f59e0b');
    }
  }

  private update(delta: number) {
    if (this.isGameOver) return;

    // Movement calculation
    const moveSpeed = 9 * this.playerCharacter.speed;
    let dx = 0;
    let dz = 0;

    if (this.keys['w'] || this.keys['arrowup']) dz -= 1;
    if (this.keys['s'] || this.keys['arrowdown']) dz += 1;
    if (this.keys['a'] || this.keys['arrowleft']) dx -= 1;
    if (this.keys['d'] || this.keys['arrowright']) dx += 1;

    // Add joystick input
    dx += this.joystickMove.x;
    dz += this.joystickMove.y;

    if (dx !== 0 || dz !== 0) {
      const moveVec = new THREE.Vector3(dx, 0, dz).normalize();
      this.playerGroup.position.x += moveVec.x * moveSpeed * delta;
      this.playerGroup.position.z += moveVec.z * moveSpeed * delta;

      // Keep within arena bounds
      this.playerGroup.position.x = Math.max(-36, Math.min(36, this.playerGroup.position.x));
      this.playerGroup.position.z = Math.max(-36, Math.min(36, this.playerGroup.position.z));

      // Player faces movement direction
      this.playerGroup.rotation.y = Math.atan2(-moveVec.x, -moveVec.z);
    }

    // Gravity & Jump Physics
    if (this.isJumping) {
      this.playerGroup.position.y += this.playerVelocity.y * delta;
      this.playerVelocity.y -= 22 * delta; // Gravity

      if (this.playerGroup.position.y <= 0) {
        this.playerGroup.position.y = 0;
        this.isJumping = false;
        this.playerVelocity.y = 0;
      }
    }

    // Third-person Camera Follow
    const cameraOffset = new THREE.Vector3(0, 4.5, 9);
    // Rotate offset by cameraRotation.yaw
    cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraRotation.yaw);
    const targetCamPos = this.playerGroup.position.clone().add(cameraOffset);
    this.camera.position.lerp(targetCamPos, 0.15);

    const lookTarget = this.playerGroup.position.clone().add(new THREE.Vector3(0, 2.5, 0));
    this.camera.lookAt(lookTarget);

    // AI Enemy Behavior
    this.updateEnemyAI(delta);

    // Update bullets
    this.updateBullets(delta);

    // Ambient floating particles
    if (this.particles) {
      this.particles.rotation.y += 0.05 * delta;
    }
  }

  private updateEnemyAI(delta: number) {
    const distToPlayer = this.enemyGroup.position.distanceTo(this.playerGroup.position);

    // Face player
    this.enemyGroup.lookAt(this.playerGroup.position.x, this.enemyGroup.position.y, this.playerGroup.position.z);

    // Move towards player if too far, strafe if close
    if (distToPlayer > 12) {
      const moveDir = this.playerGroup.position.clone().sub(this.enemyGroup.position).normalize();
      this.enemyGroup.position.addScaledVector(moveDir, 4.5 * delta);
    } else {
      // Circle player
      const angle = this.clock.getElapsedTime() * 1.5;
      this.enemyGroup.position.x += Math.sin(angle) * 3 * delta;
    }

    // Attack cooldown
    this.enemyAttackTimer += delta;
    const attackInterval = this.enemyCharacter.role === 'boss' ? 1.4 : 2.0;

    if (this.enemyAttackTimer >= attackInterval) {
      this.enemyAttackTimer = 0;
      this.enemyFireBullet();
    }
  }

  private enemyFireBullet() {
    if (this.isGameOver) return;

    const bulletGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const bulletMat = new THREE.MeshBasicMaterial({ color: 0xff0044 });
    const bulletMesh = new THREE.Mesh(bulletGeo, bulletMat);

    const spawnPos = this.enemyGroup.position.clone().add(new THREE.Vector3(0, 2.5, 0));
    bulletMesh.position.copy(spawnPos);

    const targetPos = this.playerGroup.position.clone().add(new THREE.Vector3(0, 2.0, 0));
    // Player dodge chance
    targetPos.x += (Math.random() - 0.5) * 1.5;
    const dir = targetPos.clone().sub(spawnPos).normalize();

    this.scene.add(bulletMesh);
    this.bullets.push({
      mesh: bulletMesh,
      direction: dir,
      speed: 35,
      isPlayer: false,
      life: 1.8
    });

    if (Math.random() < 0.35) {
      if (this.enemyCharacter.role === 'boss') {
        this.triggerBengaliDialogue('boss_fury');
      } else {
        this.triggerBengaliDialogue('player_hurt');
      }
    }
  }

  private updateBullets(delta: number) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.mesh.position.addScaledVector(b.direction, b.speed * delta);
      b.life -= delta;

      // Check collision
      if (b.isPlayer) {
        // Player bullet hitting enemy
        const enemyCenter = this.enemyGroup.position.clone().add(new THREE.Vector3(0, 2.5, 0));
        const dist = b.mesh.position.distanceTo(enemyCenter);

        if (dist < 2.0) {
          // HIT!
          const isHeadshot = Math.random() < 0.3;
          const damage = Math.round(
            (this.currentWeapon.damage * (isHeadshot ? 2.2 : 1.0)) * this.playerCharacter.damageMultiplier
          );

          this.enemyHp = Math.max(0, this.enemyHp - damage);
          this.callbacks.onEnemyHealthChange(this.enemyHp, this.enemyMaxHp);

          if (isHeadshot) {
            this.headshots++;
            this.triggerBengaliDialogue('player_hit');
          }

          // Remove bullet
          this.scene.remove(b.mesh);
          this.bullets.splice(i, 1);

          // Check enemy defeat
          if (this.enemyHp <= 0) {
            this.handleEnemyDefeat();
          }
          continue;
        }
      } else {
        // Enemy bullet hitting player
        const playerCenter = this.playerGroup.position.clone().add(new THREE.Vector3(0, 2.0, 0));
        const dist = b.mesh.position.distanceTo(playerCenter);

        if (dist < 1.6) {
          // PLAYER HURT!
          const damage = Math.round(18 * this.enemyCharacter.damageMultiplier);
          this.playerHp = Math.max(0, this.playerHp - damage);
          this.callbacks.onPlayerHealthChange(this.playerHp, this.playerMaxHp);

          soundManager.play('snd_player_damaged');

          this.scene.remove(b.mesh);
          this.bullets.splice(i, 1);

          if (this.playerHp <= 0) {
            this.handlePlayerDefeat();
          }
          continue;
        }
      }

      if (b.life <= 0) {
        this.scene.remove(b.mesh);
        this.bullets.splice(i, 1);
      }
    }
  }

  private handleEnemyDefeat() {
    this.isGameOver = true;
    this.kills++;
    this.callbacks.onScoreChange(this.kills, this.headshots);
    soundManager.play('booyah_victory');
    this.callbacks.onDialogue('BOOYAH! রোহান্স গেম বিজয়ী চ্যাম্পিয়ন!', 'VICTORY', '#eab308');

    setTimeout(() => {
      this.callbacks.onBattleEnd(true);
    }, 2500);
  }

  private handlePlayerDefeat() {
    this.isGameOver = true;
    soundManager.play('villain_win');
    this.callbacks.onDialogue('তোরা আমার সামনে বাচ্চা! ভিলেন জয়ী!', this.enemyCharacter.name, '#ef4444');

    setTimeout(() => {
      this.callbacks.onBattleEnd(false);
    }, 2800);
  }

  private animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.1);
    this.update(delta);
    this.renderer.render(this.scene, this.camera);
  };

  public destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('resize', this.handleResize);

    this.bullets.forEach(b => this.scene.remove(b.mesh));
    this.bullets = [];

    if (this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
