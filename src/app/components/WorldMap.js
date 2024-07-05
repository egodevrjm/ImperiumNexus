'use client';

import React, { useState, useEffect } from 'react';

const GRID_SIZE = 10;

const terrainTypes = ['Plains', 'Mountains', 'Forest', 'Desert', 'Water'];

const getRandomTerrain = () => terrainTypes[Math.floor(Math.random() * terrainTypes.length)];

const WorldMap = ({ playerNation }) => {
  const [map, setMap] = useState([]);

  useEffect(() => {
    const newMap = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill().map(() => getRandomTerrain()));
    // Place the capital city
    const capitalX = Math.floor(Math.random() * GRID_SIZE);
    const capitalY = Math.floor(Math.random() * GRID_SIZE);
    newMap[capitalY][capitalX] = 'Capital';
    setMap(newMap);
  }, [playerNation]);

  const getTerrainColor = (terrain) => {
    switch(terrain) {
      case 'Plains': return 'bg-green-300 dark:bg-green-700';
      case 'Mountains': return 'bg-gray-500 dark:bg-gray-600';
      case 'Forest': return 'bg-green-700 dark:bg-green-900';
      case 'Desert': return 'bg-yellow-300 dark:bg-yellow-600';
      case 'Water': return 'bg-blue-500 dark:bg-blue-800';
      case 'Capital': return 'bg-red-500 dark:bg-red-700';
      default: return 'bg-gray-200 dark:bg-gray-700';
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">World Map - {playerNation?.name}</h2>
      <div className="grid grid-cols-10 gap-1">
        {map.map((row, i) => 
          row.map((cell, j) => (
            <div 
              key={`${i}-${j}`} 
              className={`w-12 h-12 ${getTerrainColor(cell)} flex items-center justify-center text-xs text-black dark:text-white`}
              title={cell === 'Capital' ? `${playerNation.capital} (Capital)` : cell}
            >
              {cell === 'Capital' ? '🏰' : cell[0]}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WorldMap;