'use client';

import React, { useState } from 'react';

const Diplomacy = ({ diplomacy, players, playerNation }) => {
  const [relations, setRelations] = useState(diplomacy);
  const [selectedNation, setSelectedNation] = useState(null);

  const handleAction = (action) => {
    if (selectedNation) {
      setRelations(prev => ({
        ...prev,
        [selectedNation.id]: Math.max(-100, Math.min(100, prev[selectedNation.id] + action))
      }));
    }
  };

  const getRelationStatus = (value) => {
    if (value <= -50) return 'Hostile';
    if (value <= -20) return 'Unfriendly';
    if (value < 20) return 'Neutral';
    if (value < 50) return 'Friendly';
    return 'Allied';
  };

  const aiNations = players.filter(nation => nation.id !== playerNation.id);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Diplomacy</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Relations</h3>
          {aiNations.map(nation => (
            <div 
              key={nation.id} 
              className={`p-2 mb-2 border rounded cursor-pointer 
                ${selectedNation?.id === nation.id ? 'bg-blue-100 dark:bg-blue-900' : 'bg-white dark:bg-gray-800'}
                border-gray-300 dark:border-gray-600`}
              onClick={() => setSelectedNation(nation)}
            >
              <span className="font-bold">{nation.name}</span>: {relations[nation.id]} ({getRelationStatus(relations[nation.id])})
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Actions</h3>
          {selectedNation ? (
            <>
              <button 
                onClick={() => handleAction(10)}
                className="w-full mb-2 px-4 py-2 bg-green-500 dark:bg-green-700 text-white rounded hover:bg-green-600 dark:hover:bg-green-800"
              >
                Send Gift (+10)
              </button>
              <button 
                onClick={() => handleAction(20)}
                className="w-full mb-2 px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-800"
              >
                Propose Alliance (+20)
              </button>
              <button 
                onClick={() => handleAction(-15)}
                className="w-full mb-2 px-4 py-2 bg-yellow-500 dark:bg-yellow-700 text-white rounded hover:bg-yellow-600 dark:hover:bg-yellow-800"
              >
                Demand Tribute (-15)
              </button>
              <button 
                onClick={() => handleAction(-25)}
                className="w-full mb-2 px-4 py-2 bg-red-500 dark:bg-red-700 text-white rounded hover:bg-red-600 dark:hover:bg-red-800"
              >
                Declare War (-25)
              </button>
            </>
          ) : (
            <p>Select a nation to perform actions</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Diplomacy;