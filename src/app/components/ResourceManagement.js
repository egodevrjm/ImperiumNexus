'use client';

import React, { useState, useEffect } from 'react';

const ResourceManagement = ({ resources, cities, onAllocateWorker }) => {
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    if (cities.length > 0 && !selectedCity) {
      setSelectedCity(cities[0]);
    }
  }, [cities, selectedCity]);

  const calculateTotalProduction = (resource) => {
    return cities.reduce((total, city) => total + (city.production?.[resource] || 0), 0);
  };

  const handleAllocateWorker = (resource, amount) => {
    if (selectedCity) {
      onAllocateWorker(selectedCity.id, resource, amount);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Resource Management</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Resources</h3>
          {Object.entries(resources).map(([resource, amount]) => (
            <div key={resource} className="flex justify-between items-center mb-2 bg-gray-100 dark:bg-gray-800 p-2 rounded">
              <span className="capitalize">{resource}:</span>
              <span>{amount}</span>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Production (per turn)</h3>
          {Object.keys(resources).map(resource => (
            <div key={resource} className="flex justify-between items-center mb-2 bg-gray-100 dark:bg-gray-800 p-2 rounded">
              <span className="capitalize">{resource}:</span>
              <span>{calculateTotalProduction(resource)}</span>
            </div>
          ))}
        </div>
      </div>
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
        {selectedCity && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
            <h4 className="font-bold mb-2">{selectedCity.name}</h4>
            {Object.entries(resources).map(([resource]) => (
              <div key={resource} className="flex justify-between items-center mb-2">
                <span className="capitalize">{resource}:</span>
                <span>{selectedCity.production?.[resource] || 0} per turn</span>
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
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Resource Tips</h3>
        <ul className="list-disc pl-5">
          <li>Build farms to increase food production</li>
          <li>Construct mines to boost gold and iron output</li>
          <li>Develop lumber mills for more wood</li>
          <li>Invest in universities to generate science</li>
          <li>Trade with other nations for resources you lack</li>
        </ul>
      </div>
    </div>
  );
};

export default ResourceManagement;