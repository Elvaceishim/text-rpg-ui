// src/components/BattleLog.jsx
import React from 'react';

const BattleLog = ({ logs }) => {
  return (
    <div className="bg-black text-green-400 p-4 mt-4 rounded-lg h-48 overflow-y-auto text-sm shadow-inner border border-gray-700">
      <h2 className="font-bold text-white mb-2">Battle Log</h2>
      {logs.length === 0 ? (
        <p className="italic text-gray-400">No actions yet...</p>
      ) : (
        logs.map((entry, index) => (
          <div key={index} className="mb-1">
            • {entry}
          </div>
        ))
      )}
    </div>
  );
};

export default BattleLog;
