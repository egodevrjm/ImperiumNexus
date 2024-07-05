'use client';

import React, { useState, useEffect } from 'react';

const DEFAULT_RESOURCES = {
  gold: 0,
  food: 0,
  production: 0,
  science: 0
};

const ResourceManagement = ({ resources = DEFAULT_RESOURCES, cities = [], onAllocateWorker }) => {
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    if (cities.length > 0 && !selectedCity) {
      setSelectedCity(cities[0]);
    }
  }, [cities, selectedCity]);

  const calculateTotalProduction = (resource) => {
    return cities.reduce((total, city) => {
      const production = city?.production || {};
      return total + (production[resource] || 0);
    }, 0);
  };

  const handleAllocateWorker = (resource, amount) => {
    if (selectedCity && onAllocateWorker) {
      onAllocateWorker(selectedCity.id, resource, amount);
    }
  };

  const renderResourceList = (resourceObj, title, showButtons = false) => (
    <div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {Object.entries(resourceObj).map(([resource, amount]) => (
        <div key={resource} className="flex justify-between items-center mb-2 bg-gray-100 dark:bg-gray-800 p-2 rounded">
          <span className="capitalize">{resource}:</span>
          <span>{amount}</span>
          {showButtons && (
            <div>
              <button 
                onClick={() => handleAllocateWorker(resource, -1)}
                className="px-2 py-1 bg-red-500 text-white rounded mr-2"
              >
                -
              </button>
              <button 
                onClick={() => handleAllocateWorker(resource, 1)}
                className="px-2 py-1 bg-green-500 text-white rounded"
              >
                +
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Resource Management</h2>
      <div className="grid grid-cols-2 gap-4">
        {renderResourceList(resources, "Resources")}
        {renderResourceList(Object.fromEntries(
          Object.keys(resources).map(resource => [resource, calculateTotalProduction(resource)])
        ), "Production (per turn)")}
      </div>
      {cities.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">City Production</h3>
          <select 
            className="w-full p-2 mb-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
            onChange={(e) => setSelectedCity(cities.find(city => city.id === e.target.value))}
            value={selectedCity?.id || ''}
          >
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
          {selectedCity && renderResourceList(selectedCity.production || {}, selectedCity.name, true)}
        </div>
      )}
    </div>
  );
};

export default ResourceManagement;