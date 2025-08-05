# 🗡️ Text RPG Battle UI

A modern, interactive text-based RPG battle system built with React, Vite, and Tailwind CSS.

## ✨ Features

### 🎮 **Core Gameplay**
- **Turn-based Combat** - Strategic battle system with player and AI turns
- **Resource Management** - Limited heals (3) and potions (3) per battle
- **Smart Enemy AI** - Adaptive AI that uses heals and potions strategically
- **Character Progression** - XP and leveling system with stat increases

### 🎨 **User Interface**
- **Modern Design** - Clean, responsive UI with Tailwind CSS
- **Real-time Feedback** - Animated HP bars and character cards
- **Interactive Battle Log** - Scrolling terminal-style action feed
- **Visual Animations** - Attack animations and state transitions
- **Sound Effects** - Audio feedback for attacks, heals, victory, and defeat

### 🤖 **AI Features**
- **Priority-based Decisions** - Enemy uses emergency heals, strategic potions
- **Adaptive Behavior** - AI adjusts strategy based on HP and available resources
- **Balanced Difficulty** - Both characters start with equal HP (100) and resources

## 🚀 **Getting Started**

### Installation

1. **Install dependencies**
   ```bash
   yarn install
   ```

2. **Start the development server**
   ```bash
   yarn dev
   ```

3. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🎯 **How to Play**

### **Combat System**
- **Attack** ⚔️ - Deal damage to the enemy
- **Heal** ✨ - Restore 20 HP (limited to 3 uses)
- **Use Potion** 💊 - Restore 15 HP (limited to 3 potions)

### **Victory Conditions**
- Defeat the enemy by reducing their HP to 0
- Gain XP and potentially level up after victory
- Click "Restart Game" to play again

## 🛠️ **Tech Stack**

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Web Audio API** - Browser-based sound effects

---

**Enjoy your RPG adventure! ⚔️🛡️**
