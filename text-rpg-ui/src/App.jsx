// src/App.jsx
import React from 'react';
import Game from './components/Game';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white flex items-center justify-center">
      <Game />
    </div>
  );
};

export default App;
