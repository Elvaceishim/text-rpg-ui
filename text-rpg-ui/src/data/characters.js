//Constructor Function
function Character(name, maxHP, attackPower, xp = 0, level = 1) {
  this.name = name;
  this.maxHP = maxHP;
  this.hp = maxHP; // Changed from currentHP to hp to match Game.jsx
  this.attackPower = attackPower;
  this.xp = xp;
  this.level = level;
  this.weapon = null;
  this.healsRemaining = 3; // Limit heals to 3 per battle
  this.inventory = [
    { name: 'Potion', type: 'heal', value: 15 },
    { name: 'Potion', type: 'heal', value: 15 },
    { name: 'Potion', type: 'heal', value: 15 } // Give 3 potions
  ];
}

//Prototype Methods

// Attack now includes weapon bonus
Character.prototype.attack = function () {
  const base = Math.floor(Math.random() * this.attackPower) + 1;
  const bonus = this.weapon ? this.weapon.attackBonus : 0;
  return base + bonus;
};

// XP + Leveling up
Character.prototype.gainXP = function (amount) {
  this.xp += amount;
  if (this.xp >= this.level * 50) {
    this.level++;
    this.maxHP += 10;
    this.attackPower += 2;
    this.hp = this.maxHP; // full heal
    return `${this.name} leveled up to Level ${this.level}!`;
  }
  return null;
};

// Set weapon
Character.prototype.setWeapon = function (weapon) {
  this.weapon = weapon;
  return `${this.name} equipped ${weapon.name}!`;
};

// Use item from inventory
Character.prototype.useItem = function (itemName) {
  const index = this.inventory.findIndex(item => item.name === itemName);
  if (index !== -1) {
    const item = this.inventory[index];
    this.inventory.splice(index, 1); // Remove item
    return item;
  }
  return null;
};

// Heal method with limit
Character.prototype.heal = function () {
  if (this.healsRemaining <= 0) {
    return null; // No heals left
  }
  
  const healAmount = 20;
  this.hp = Math.min(this.hp + healAmount, this.maxHP);
  this.healsRemaining--;
  return healAmount;
};

// Example Weapons
const sword = { name: 'Iron Sword', attackBonus: 5 };
const axe = { name: 'Battle Axe', attackBonus: 8 };

//Create characters - both with 100 HP for balanced gameplay
const hero = new Character("Thorn the Warrior", 100, 15);
const enemy = new Character("Goblin Warrior", 100, 12);

// Give weapon to hero
hero.setWeapon(sword);

const charactersData = {
  hero,
  enemy
};

export default charactersData;
