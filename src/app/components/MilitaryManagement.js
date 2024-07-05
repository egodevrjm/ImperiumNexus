'use client';

import React from 'react';
import { getAvailableUnits, technologies } from '../gameData';

const MilitaryManagement = ({ military, researchedTechs, resources, onRecruit }) => {
  const availableUnits = getAvailableUnits(researchedTechs);

  const calculateStrengthBonus = () => {
    return researchedTechs.reduce((bonus, techId) => {
      const tech = technologies.find(t => t.id === techId);
      return bonus * (tech.effects.bonuses.militaryStrength || 1);
    }, 1);
  };

  const strengthBonus = calculateStrengthBonus();

  const calculateTotalStrength = () => {
    return Object.entries(military).reduce((total, [unitId, count]) => {
      const unit = availableUnits.find(u => u.id === unitId);
      return total + (unit ? unit.strength * count * strengthBonus : 0);
    }, 0);
  };

  const handleRecruit = (unitId) => {
    const unit = availableUnits.find(u => u.id === unitId);
    if (resources.gold >= unit.cost) {
      onRecruit(unitId);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Military Management</h2>
      <div className="mb-4 bg-gray-100 dark:bg-gray-800 p-4 rounded">
        <h3 className="text-xl font-semibold mb-2">Army Overview</h3>
        <p>Total Strength: {calculateTotalStrength().toFixed(2)}</p>
        <p>Strength Bonus from Technology: {((strengthBonus - 1) * 100).toFixed(2)}%</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Recruit Units</h3>
          {availableUnits.map(unit => (
            <div key={unit.id} className="mb-2 p-2 bg-white dark:bg-gray-700 rounded shadow">
              <h4 className="font-semibold">{unit.name}</h4>
              <p>Strength: {(unit.strength * strengthBonus).toFixed(2)}</p>
              <p>Cost: {unit.cost} gold</p>
              <button
                onClick={() => handleRecruit(unit.id)}
                disabled={resources.gold < unit.cost}
                className="mt-2 px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-800 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:text-gray-500 dark:disabled:text-gray-400"
              >
                Recruit
              </button>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Your Army</h3>
          {Object.entries(military).map(([unitId, count]) => {
            const unit = availableUnits.find(u => u.id === unitId);
            if (!unit) return null;
            return (
              <div key={unitId} className="mb-2 p-2 bg-white dark:bg-gray-700 rounded shadow">
                <h4 className="font-semibold">{unit.name}</h4>
                <p>Count: {count}</p>
                <p>Total Strength: {(unit.strength * count * strengthBonus).toFixed(2)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MilitaryManagement;