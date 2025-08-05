// src/components/ActionButton.jsx
import React from 'react';

const ActionButton = ({ onClick, children, variant = 'primary', disabled = false }) => {
  const baseClasses = "px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 text-sm sm:text-base";
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg",
    success: "bg-green-600 hover:bg-green-700 text-white shadow-lg",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white shadow-lg"
  };

  const disabledClasses = "opacity-50 cursor-not-allowed transform-none hover:scale-100";

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? disabledClasses : ''}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ActionButton;
