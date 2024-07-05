'use client';

import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { nations, getRandomNation, initialResources, initializeNationCities } from './gameData';

import WorldMap from './components/WorldMap';
import CityManagement from './components/CityManagement';
import ResourceManagement from './components/ResourceManagement';
import Diplomacy from './components/Diplomacy';
import TechnologyTree from './components/TechnologyTree';
import TradeSystem from './components/TradeSystem';
import MilitaryManagement from './components/MilitaryManagement';

const DEFAULT_PLAYER_DATA = {
  resources: initialResources,
  cities: [],
  military: {},
  researchedTechs: []
};

const EmpireManagementGame = () => {
  const [gameState, setGameState] = useState({
    turn: 1,
    players: [],
    currentPlayer: 0,
    diplomacy: {},
    technologies: [],
  });

  const [playerNation, setPlayerNation] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('nationSelection');
  const [isLoading, setIsLoading] = useState(false);

  const initializeGame = (selectedNation) => {
    setIsLoading(true);
    const aiNations = [];
    for (let i = 0; i < 3; i++) {
      const aiNation = getRandomNation([selectedNation.id, ...aiNations.map(n => n.id)]);
      aiNations.push({
        ...aiNation,
        id: aiNation.id,
        isAI: true,
        resources: { ...initialResources },
        cities: initializeNationCities(aiNation),
        military: { [aiNation.specialUnit]: 1 },
        researchedTechs: []
      });
    }

    const playerCities = initializeNationCities(selectedNation);

    const allPlayers = [
      {
        ...selectedNation,
        id: selectedNation.id,
        isAI: false,
        resources: { ...initialResources },
        cities: playerCities,
        military: { [selectedNation.specialUnit]: 1 },
        researchedTechs: []
      },
      ...aiNations
    ];

    setGameState({
      turn: 1,
      players: allPlayers,
      currentPlayer: 0,
      diplomacy: Object.fromEntries(aiNations.map(nation => [nation.id, 0])),
      technologies: [],
    });

    setPlayerNation(selectedNation);
    setCurrentScreen('worldMap');
    setIsLoading(false);
  };

  const handleAllocateWorker = (cityId, resource, amount) => {
    setGameState(prevState => {
      const updatedPlayers = prevState.players.map(player => {
        if (player.id === playerNation.id) {
          const updatedCities = player.cities.map(city => {
            if (city.id === cityId) {
              return {
                ...city,
                production: {
                  ...city.production,
                  [resource]: Math.max((city.production?.[resource] || 0) + amount, 0)
                }
              };
            }
            return city;
          });
          return { ...player, cities: updatedCities };
        }
        return player;
      });

      return {
        ...prevState,
        players: updatedPlayers
      };
    });
  };

  const renderScreen = () => {
    const currentPlayerData = gameState.players.find(p => p.id === playerNation?.id) || DEFAULT_PLAYER_DATA;
    
    switch (currentScreen) {
      case 'nationSelection':
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Select Your Nation</h2>
            <div className="grid grid-cols-2 gap-4">
              {nations.map(nation => (
                <button
                  key={nation.id}
                  onClick={() => initializeGame(nation)}
                  className="p-4 bg-blue-500 dark:bg-blue-700 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-800"
                >
                  <h3 className="font-bold">{nation.name}</h3>
                  <p>Capital: {nation.capital}</p>
                  <p>Special Unit: {nation.specialUnit}</p>
                  <p>Bonus: {nation.bonus}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 'worldMap': 
        return <WorldMap playerNation={playerNation} players={gameState.players} />;
      case 'cityManagement': 
        return <CityManagement cities={currentPlayerData.cities} />;
      case 'resourceManagement': 
        return <ResourceManagement 
          resources={currentPlayerData.resources}
          cities={currentPlayerData.cities}
          onAllocateWorker={handleAllocateWorker}
        />;
      case 'diplomacy': 
        return <Diplomacy diplomacy={gameState.diplomacy} players={gameState.players} playerNation={playerNation} />;
      case 'technologyTree': 
        return <TechnologyTree technologies={gameState.technologies} />;
      case 'tradeSystem': 
        return <TradeSystem resources={currentPlayerData.resources} players={gameState.players} playerNation={playerNation} />;
      case 'militaryManagement': 
        return <MilitaryManagement military={currentPlayerData.military} playerNation={playerNation} />;
      default: 
        return <WorldMap playerNation={playerNation} players={gameState.players} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <Loader className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="mb-4">
        <h1 className="text-3xl font-bold">Imperium Nexus</h1>
        {playerNation && (
          <div className="flex justify-between items-center mt-2">
            <p>Turn: {gameState.turn}</p>
            <p>Nation: {playerNation.name}</p>
            <button 
              onClick={() => {/* Implement turn advancement logic */}}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              End Turn
            </button>
          </div>
        )}
      </header>

      {playerNation && (
        <nav className="mb-4">
          <ul className="flex space-x-4">
            {['worldMap', 'cityManagement', 'resourceManagement', 'diplomacy', 'technologyTree', 'tradeSystem', 'militaryManagement'].map((screen) => (
              <li key={screen}>
                <button 
                  onClick={() => setCurrentScreen(screen)}
                  className={`px-3 py-1 rounded ${currentScreen === screen 
                    ? 'bg-blue-500 text-white dark:bg-blue-700' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
                >
                  {screen.charAt(0).toUpperCase() + screen.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <main className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg min-h-[500px]">
        {renderScreen()}
      </main>

      {playerNation && gameState.players.length > 0 && (
        <footer className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Resources</h2>
          <ul className="flex space-x-4">
            {Object.entries(gameState.players[0].resources || {}).map(([resource, amount]) => (
              <li key={resource} className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded">
                {resource}: {amount}
              </li>
            ))}
          </ul>
        </footer>
      )}
    </div>
  );
};

export default EmpireManagementGame;