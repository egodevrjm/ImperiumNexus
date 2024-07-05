'use client';

import React from 'react';
import { technologies, getAvailableTechnologies } from '../gameData';

const TechnologyTree = ({ researchedTechs, onResearch, resources }) => {
  const availableTechs = getAvailableTechnologies(researchedTechs);

  const handleResearch = (techId) => {
    const tech = technologies.find(t => t.id === techId);
    if (resources.science >= tech.cost) {
      onResearch(techId);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Technology Tree</h2>
      <p className="mb-4">Available Science: {resources.science}</p>
      <div className="grid grid-cols-2 gap-4">
        {availableTechs.map(tech => (
          <div key={tech.id} className="border p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{tech.name}</h3>
            <p>Cost: {tech.cost} science</p>
            <p>Unlocks:</p>
            <ul className="list-disc pl-5">
              {tech.effects.buildings.map(building => (
                <li key={building}>Building: {building}</li>
              ))}
              {tech.effects.units.map(unit => (
                <li key={unit}>Unit: {unit}</li>
              ))}
            </ul>
            <button
              onClick={() => handleResearch(tech.id)}
              disabled={resources.science < tech.cost}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              Research
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnologyTree;