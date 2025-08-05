import React, { useState } from "react";
import charactersData from "../data/characters";
import CharacterCard from "./CharacterCard";
import ActionButton from "./ActionButton";
import BattleLog from "./BattleLog";

function Game() {
  // Create new instances to preserve prototype methods
  const [hero, setHero] = useState(() => {
    const newHero = Object.create(charactersData.hero);
    Object.assign(newHero, charactersData.hero);
    return newHero;
  });
  
  const [enemy, setEnemy] = useState(() => {
    const newEnemy = Object.create(charactersData.enemy);
    Object.assign(newEnemy, charactersData.enemy);
    return newEnemy;
  });
  
  const [log, setLog] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [isAttacking, setIsAttacking] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Initialize audio context on first user interaction
  const initializeAudio = async () => {
    if (!audioEnabled) {
      try {
        let context = audioContext;
        if (!context) {
          context = new (window.AudioContext || window.webkitAudioContext)();
          setAudioContext(context);
        }
        
        if (context.state === 'suspended') {
          await context.resume();
          console.log('Audio context resumed');
        }
        
        setAudioEnabled(true);
        console.log('Audio initialized successfully, state:', context.state);
        
        // Test sound to confirm audio is working
        playTestSound(context);
      } catch (error) {
        console.error('Audio initialization failed:', error);
        setAudioEnabled(false);
      }
    } else {
      console.log('Audio already enabled');
    }
  };

  // Test sound function
  const playTestSound = (context) => {
    try {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.frequency.value = 440; // A note
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.2);
      
      oscillator.start();
      oscillator.stop(context.currentTime + 0.2);
      console.log('Test sound played');
    } catch (error) {
      console.error('Test sound failed:', error);
    }
  };

  // Enhanced sound effects that work on mobile
  const playSound = async (type) => {
    console.log('playSound called with type:', type, 'audioEnabled:', audioEnabled);
    
    // Initialize audio on first interaction if not already done
    if (!audioEnabled) {
      await initializeAudio();
    }

    // Add haptic feedback for mobile devices
    if (navigator.vibrate) {
      switch(type) {
        case 'attack':
          navigator.vibrate(50);
          break;
        case 'heal':
          navigator.vibrate([30, 30, 30]);
          break;
        case 'victory':
          navigator.vibrate([100, 50, 100, 50, 100]);
          break;
        case 'defeat':
          navigator.vibrate(200);
          break;
      }
    }

    if (!audioContext || !audioEnabled) {
      console.log('Audio not available, audioContext:', !!audioContext, 'audioEnabled:', audioEnabled);
      return;
    }

    try {
      console.log('Creating audio for type:', type);
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different sounds for different actions (reduced volume for mobile)
      switch(type) {
        case 'attack':
          oscillator.frequency.value = 200;
          oscillator.type = 'square';
          gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
          break;
        case 'heal':
          oscillator.frequency.value = 400;
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
          break;
        case 'victory':
          oscillator.frequency.value = 523; // C note
          oscillator.type = 'square';
          gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
          break;
        case 'defeat':
          oscillator.frequency.value = 150;
          oscillator.type = 'sawtooth';
          gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8);
          break;
        default:
          oscillator.frequency.value = 300;
          gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
      }
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
      console.log('Sound played successfully for type:', type);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  // Debug logs to see initial states
  console.log('Initial hero:', hero);
  console.log('Initial enemy:', enemy);
  console.log('Hero attack method:', typeof hero.attack);

  const addToLog = (entry) => {
    setLog((prev) => [entry, ...prev]);
  };

  const handleAttack = () => {
    if (gameOver) return;

    setIsAttacking(true);
    console.log('Attack clicked!'); // Debug log
    playSound('attack'); // Add attack sound
    
    const heroDamage = hero.attack();
    console.log('Hero damage:', heroDamage); // Debug log
    
    const newEnemyHP = Math.max(enemy.hp - heroDamage, 0);
    console.log('Enemy HP before:', enemy.hp, 'after:', newEnemyHP); // Debug log
    
    addToLog(`⚔️ ${hero.name} attacks for ${heroDamage} damage!`);

    const updatedEnemy = Object.create(Object.getPrototypeOf(enemy));
    Object.assign(updatedEnemy, enemy, { hp: newEnemyHP });
    setEnemy(updatedEnemy);

    playSound('attack'); // Play attack sound

    if (newEnemyHP <= 0) {
      const xpGain = 30;
      const levelUpMsg = hero.gainXP(xpGain);
      setHero({ ...hero });
      setGameOver(true);
      setMessage("Victory! You defeated the enemy.");
      playSound('victory'); // Victory sound
      addToLog(`🏆 ${hero.name} gains ${xpGain} XP.`);
      if (levelUpMsg) addToLog(`✨ ${levelUpMsg}`);
      setIsAttacking(false);
      playSound('victory'); // Play victory sound
      return;
    }

    setTimeout(() => {
      // Enhanced Enemy AI - much more aggressive healing strategy
      
      // Priority 1: Use potion if critically low HP (guaranteed)
      if (enemy.hp <= 25 && enemy.inventory.length > 0) {
        const enemyPotion = enemy.useItem("Potion");
        if (enemyPotion && enemyPotion.type === "heal") {
          const newEnemyHP = Math.min(enemy.hp + enemyPotion.value, enemy.maxHP);
          const enemyHealAmount = newEnemyHP - enemy.hp;
          
          const updatedEnemyPotioned = Object.create(Object.getPrototypeOf(enemy));
          Object.assign(updatedEnemyPotioned, enemy, { hp: newEnemyHP });
          setEnemy(updatedEnemyPotioned);
          
          const enemyPotionsLeft = updatedEnemyPotioned.inventory.filter(item => item.name === "Potion").length;
          addToLog(`💊 ${enemy.name} used a Potion and healed ${enemyHealAmount} HP! (${enemyPotionsLeft} potions left)`);
          return;
        }
      }

      // Priority 2: Heal if low-medium HP and has heals (high chance)
      if (enemy.hp <= 50 && enemy.healsRemaining > 0 && Math.random() < 0.85) {
        const enemyHealAmount = enemy.heal();
        if (enemyHealAmount) {
          addToLog(`✨ ${enemy.name} heals for ${enemyHealAmount} HP! (${enemy.healsRemaining} heals left)`);
          
          const updatedEnemyHealed = Object.create(Object.getPrototypeOf(enemy));
          Object.assign(updatedEnemyHealed, enemy);
          setEnemy(updatedEnemyHealed);
          return;
        }
      }

      // Priority 3: Use potion proactively if moderate HP and has many potions
      if (enemy.hp <= 40 && enemy.inventory.length >= 2 && Math.random() < 0.60) {
        const enemyPotion = enemy.useItem("Potion");
        if (enemyPotion && enemyPotion.type === "heal") {
          const newEnemyHP = Math.min(enemy.hp + enemyPotion.value, enemy.maxHP);
          const enemyHealAmount = newEnemyHP - enemy.hp;
          
          const updatedEnemyPotioned = Object.create(Object.getPrototypeOf(enemy));
          Object.assign(updatedEnemyPotioned, enemy, { hp: newEnemyHP });
          setEnemy(updatedEnemyPotioned);
          
          const enemyPotionsLeft = updatedEnemyPotioned.inventory.filter(item => item.name === "Potion").length;
          addToLog(`💊 ${enemy.name} used a Potion strategically and healed ${enemyHealAmount} HP! (${enemyPotionsLeft} potions left)`);
          return;
        }
      }

      // Priority 4: Save some resources but heal if moderately hurt and plenty of heals left
      if (enemy.hp <= 65 && enemy.healsRemaining >= 2 && Math.random() < 0.50) {
        const enemyHealAmount = enemy.heal();
        if (enemyHealAmount) {
          addToLog(`✨ ${enemy.name} heals preventively for ${enemyHealAmount} HP! (${enemy.healsRemaining} heals left)`);
          
          const updatedEnemyHealed = Object.create(Object.getPrototypeOf(enemy));
          Object.assign(updatedEnemyHealed, enemy);
          setEnemy(updatedEnemyHealed);
          return;
        }
      }

      // Default: Normal enemy attack
      const enemyDamage = enemy.attack();
      const newHeroHP = Math.max(hero.hp - enemyDamage, 0);
      addToLog(`⚔️ ${enemy.name} attacks for ${enemyDamage} damage!`);

      const updatedHero = Object.create(Object.getPrototypeOf(hero));
      Object.assign(updatedHero, hero, { hp: newHeroHP });
      setHero(updatedHero);

      playSound('attack'); // Play attack sound

      if (newHeroHP <= 0) {
        setGameOver(true);
        setMessage("Game Over! You were defeated.");
        playSound('defeat'); // Play defeat sound
      }
      setIsAttacking(false);
    }, 500);
  };

  const handleHeal = () => {
    if (gameOver) return;

    const healAmount = hero.heal();
    if (healAmount) {
      playSound('heal'); // Heal sound
      addToLog(`✨ ${hero.name} heals for ${healAmount} HP. (${hero.healsRemaining} heals left)`);
      
      const updatedHero = Object.create(Object.getPrototypeOf(hero));
      Object.assign(updatedHero, hero);
      setHero(updatedHero);
      playSound('heal'); // Play heal sound
    } else {
      addToLog(`${hero.name} has no heals remaining!`);
    }
  };

  const handleUsePotion = () => {
    if (gameOver) return;

    const potion = hero.useItem("Potion");
    if (potion && potion.type === "heal") {
      const newHP = Math.min(hero.hp + potion.value, hero.maxHP);
      const healAmount = newHP - hero.hp;
      
      const updatedHero = Object.create(Object.getPrototypeOf(hero));
      Object.assign(updatedHero, hero, { hp: newHP });
      setHero(updatedHero);
      playSound('heal'); // Play heal sound
      
      const potionsLeft = updatedHero.inventory.filter(item => item.name === "Potion").length;
      addToLog(`💊 ${hero.name} used a Potion and healed ${healAmount} HP. (${potionsLeft} potions left)`);
    } else {
      addToLog(`${hero.name} has no Potions left!`);
    }
  };

  const handleRestart = () => {
    // Create fresh instances with prototype methods
    const newHero = Object.create(charactersData.hero);
    Object.assign(newHero, charactersData.hero);
    
    const newEnemy = Object.create(charactersData.enemy);
    Object.assign(newEnemy, charactersData.enemy);
    
    setHero(newHero);
    setEnemy(newEnemy);
    setLog([]);
    setGameOver(false);
    setMessage("");
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-6 min-h-screen">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">⚔️ Text RPG Battle</h1>
        <button
          onClick={initializeAudio}
          className={`text-sm px-3 py-1 rounded transition-colors ${
            audioEnabled 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          {audioEnabled ? '🔊 Sound On' : '🔇 Tap to Enable Sound'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <div className={`transition-transform duration-300 ${isAttacking ? 'scale-105 animate-pulse' : ''}`}>
          <CharacterCard character={hero} />
        </div>
        <div className={`transition-transform duration-300 ${enemy.hp <= 0 ? 'opacity-50 scale-95' : ''}`}>
          <CharacterCard character={enemy} />
        </div>
      </div>

      {message && (
        <div className="text-center text-xl font-semibold text-red-600">
          {message}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 px-2">
        <ActionButton 
          onClick={handleAttack} 
          disabled={gameOver} 
          variant="danger">
          <span className="hidden sm:inline">Attack</span>
          <span className="sm:hidden">⚔️</span>
        </ActionButton>
        <ActionButton 
          onClick={handleHeal} 
          disabled={gameOver || hero.healsRemaining <= 0} 
          variant="success">
          <span className="hidden sm:inline">Heal ({hero.healsRemaining})</span>
          <span className="sm:hidden">✨ {hero.healsRemaining}</span>
        </ActionButton>
        <ActionButton 
          onClick={handleUsePotion} 
          disabled={gameOver || hero.inventory.filter(item => item.name === "Potion").length <= 0} 
          variant="primary">
          <span className="hidden sm:inline">Use Potion ({hero.inventory.filter(item => item.name === "Potion").length})</span>
          <span className="sm:hidden">💊 {hero.inventory.filter(item => item.name === "Potion").length}</span>
        </ActionButton>
        {gameOver && <ActionButton onClick={handleRestart} variant="secondary">
          <span className="hidden sm:inline">Restart Game</span>
          <span className="sm:hidden">🔄</span>
        </ActionButton>}
      </div>

      <BattleLog logs={log} />
    </div>
  );
}

export default Game;
