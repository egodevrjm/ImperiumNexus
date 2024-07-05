'use client';

import React, { useState } from 'react';
import { getAvailableBuildings } from '../gameData';

const CityManagement = ({ cities, researchedTechs, resources, onBuild }) => {
  const [selectedCity, setSelectedCity] = useState(null);
  const availableBuildings = getAvailableBuildings(researchedTechs);

  const handleCityClick = (city) => {
    setSelectedCity(city);
  };

  const handleBuild = (buildingId) => {
    const building = availableBuildings.find(b => b.id === buildingId);
    if (resources.gold >= building.cost) {
      onBuild(selectedCity.id, buildingId);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">City Management</h2>
      <div className="flex">
        <div className="w-1/2 pr-4">
          <h3 className="text-xl font-semibold mb-2">Cities</h3>
          {cities.map(city => (
            <div 
              key={city.id} 
              className={`p-2 mb-2 border rounded cursor-pointer ${selectedCity?.id === city.id ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
              onClick={() => handleCityClick(city)}
            >
              <h4 className="font-bold">{city.name}</h4>
              <p>Population: {city.population.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="w-1/2 pl-4">
          <h3 className="text-xl font-semibold mb-2">City Details</h3>
          {selectedCity ? (
            <>
              <h4 className="font-bold">{selectedCity.name}</h4>
              <p>Population: {selectedCity.population.toLocaleString()}</p>
              <h5 className="font-semibold mt-2">Buildings:</h5>
              <ul className="list-disc pl-5">
                {selectedCity.buildings.map((building, index) => (
                  <li key={index}>{building}</li>
                ))}
              </ul>
              <h5 className="font-semibold mt-2">Available Buildings:</h5>
              {availableBuildings.map(building => (
                <button 
                  key={building.id}
                  className="mt-2 px-4 py-2 bg-green-500 dark:bg-green-700 text-white rounded hover:bg-green-600 dark:hover:bg-green-800 mr-2"
                  onClick={() => handleBuild(building.id)}
                  disabled={resources.gold < building.cost}
                >
                  Build {building.name} (Cost: {building.cost} gold)
                </button>
              ))}
            </>
          ) : (
            <p>Select a city to view details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CityManagement;