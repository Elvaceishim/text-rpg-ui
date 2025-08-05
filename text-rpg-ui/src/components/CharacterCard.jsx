import React from 'react';

const CharacterCard = ({ character }) => {
  const { name, hp, maxHP, xp, level } = character;

  const hpPercent = (hp / maxHP) * 100;

  return (
    <div className="bg-gray-900 text-white p-3 sm:p-4 rounded-lg w-full max-w-64 mx-auto shadow-md">
      <h2 className="text-lg sm:text-xl font-bold mb-2 text-center">{name}</h2>

      <div className="mb-2">
        <p className="text-xs sm:text-sm">HP: {hp} / {maxHP}</p>
        <div className="w-full bg-red-800 h-3 sm:h-4 rounded">
          <div
            className="bg-red-500 h-3 sm:h-4 rounded transition-all duration-300"
            style={{ width: `${hpPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="text-xs sm:text-sm space-y-1">
        <p>Level: {level}</p>
        <p>XP: {xp}</p>
        <p>Heals: {character.healsRemaining || 0}</p>
      </div>

      {character.inventory && (
        <div className="mt-2 text-xs sm:text-sm text-gray-300">
          <strong>Potions:</strong> {character.inventory.filter(item => item.name === "Potion").length}
        </div>
      )}
    </div>
  );
};

export default CharacterCard;