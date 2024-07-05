'use client';

import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { nations, getRandomNation, initialResources, initializeNationCities, technologies } from './gameData';

import WorldMap from './components/WorldMap';
import CityManagement from './components/CityManagement';
import ResourceManagement from './components/ResourceManagement';
import Diplomacy from './components/Diplomacy';
import TechnologyTree from './components/TechnologyTree';
import TradeSystem from './components/TradeSystem';
import MilitaryManagement from './components/MilitaryManagement';

const EmpireManagementGame = () => {
  const [gameState, setGameState] = useState({
    turn: 1,
    players: [],
    currentPlayer: 0,
    resources: { ...initialResources, science: 0 },
    cities: [],
    diplomacy: {},
    technologies: [],
    military: {},
    researchedTechs: []
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
        isAI: true,
        resources: { ...initialResources, science: 0 },
        cities: initializeNationCities(aiNation),
        military: { [aiNation.specialUnit]: 1 },
        researchedTechs: []
      });
    }

    const playerCities = initializeNationCities(selectedNation);

    const initialPlayerData = {
      ...selectedNation,
      isAI: false,
      resources: { 
        gold: 1000, 
        food: 500, 
        production: 300, 
        science: 0 
      },
      cities: playerCities,
      military: { [selectedNation.specialUnit]: 1 },
      researchedTechs: []
    };
    
    const allPlayers = [
      {
        ...selectedNation,
        isAI: false,
        resources: { ...initialResources, science: 0 },
        cities: playerCities,
        military: { [selectedNation.specialUnit]: 1 },
        researchedTechs: []
      },
      ...aiNations
    ];

    setGameState({
      turn: 1,
      players: [initialPlayerData, ...aiNations],
      currentPlayer: 0,
      resources: { ...initialResources, science: 0 },
      cities: playerCities,
      diplomacy: Object.fromEntries(aiNations.map(nation => [nation.id, 0])),
      technologies: [],
      military: { [selectedNation.specialUnit]: 1 },
      researchedTechs: []
    });

    setPlayerNation(selectedNation);
    setCurrentScreen('worldMap');
    setIsLoading(false);
  };

  const handleResearch = (techId) => {
    setGameState(prevState => {
      const tech = technologies.find(t => t.id === techId);
      const updatedResources = { ...prevState.resources, science: prevState.resources.science - tech.cost };
      const updatedResearchedTechs = [...prevState.researchedTechs, techId];
      
      return {
        ...prevState,
        resources: updatedResources,
        researchedTechs: updatedResearchedTechs
      };
    });
  };

  const handleBuild = (cityId, buildingId) => {
    setGameState(prevState => {
      const updatedCities = prevState.cities.map(city => {
        if (city.id === cityId) {
          return {
            ...city,
            buildings: [...city.buildings, buildingId]
          };
        }
        return city;
      });

      const buildingCost = 100; // This should be dynamic based on the building type
      const updatedResources = {
        ...prevState.resources,
        gold: prevState.resources.gold - buildingCost
      };

      return {
        ...prevState,
        cities: updatedCities,
        resources: updatedResources
      };
    });
  };

  const handleRecruit = (unitId) => {
    setGameState(prevState => {
      const unitCost = 50; // This should be dynamic based on the unit type
      const updatedMilitary = {
        ...prevState.military,
        [unitId]: (prevState.military[unitId] || 0) + 1
      };
      const updatedResources = {
        ...prevState.resources,
        gold: prevState.resources.gold - unitCost
      };

      return {
        ...prevState,
        military: updatedMilitary,
        resources: updatedResources
      };
    });
  };

  const handleAllocateWorker = (cityId, resource, amount) => {
    setGameState(prevState => {
      const updatedCities = prevState.cities.map(city => {
        if (city.id === cityId) {
          return {
            ...city,
            production: {
              ...city.production,
              [resource]: Math.max((city.production[resource] || 0) + amount, 0)
            }
          };
        }
        return city;
      });
  
      return {
        ...prevState,
        cities: updatedCities
      };
    });
  };

  const handleAITurn = (aiNation) => {
    // Simple AI decision-making
    const actions = ['buildMilitary', 'improveCities', 'research'];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];

    switch (randomAction) {
      case 'buildMilitary':
        aiNation.military[aiNation.specialUnit] = (aiNation.military[aiNation.specialUnit] || 0) + 1;
        aiNation.resources.gold -= 100;
        break;
      case 'improveCities':
        aiNation.cities[0].population += 100000;
        aiNation.resources.gold -= 50;
        break;
      case 'research':
        // Placeholder for research action
        aiNation.resources.science -= 75;
        break;
    }

    // Basic resource generation
    aiNation.resources.gold += 150;
    aiNation.resources.food += 100;
    aiNation.resources.science += 25;

    return aiNation;
  };

  const advanceTurn = () => {
    setGameState(prevState => {
      const newPlayers = prevState.players.map(player => {
        if (player.isAI) {
          return handleAITurn(player);
        }
        // Handle player's turn (resource generation, etc.)
        return {
          ...player,
          resources: {
            ...player.resources,
            gold: player.resources.gold + 150,
            food: player.resources.food + 100,
            science: player.resources.science + 25
          }
        };
      });

      const currentPlayer = newPlayers[prevState.currentPlayer];

      return {
        ...prevState,
        turn: prevState.turn + 1,
        players: newPlayers,
        currentPlayer: (prevState.currentPlayer + 1) % prevState.players.length,
        resources: currentPlayer.resources,
        cities: currentPlayer.cities,
      };
    });
  };

  const handleTrade = (tradeDetails) => {
    setGameState(prevState => {
      const updatedPlayers = prevState.players.map(player => {
        if (player.id === playerNation.id) {
          return {
            ...player,
            resources: {
              ...player.resources,
              [tradeDetails.give]: player.resources[tradeDetails.give] - tradeDetails.giveAmount,
              [tradeDetails.receive]: player.resources[tradeDetails.receive] + tradeDetails.receiveAmount
            }
          };
        }
        if (player.id === tradeDetails.partnerId) {
          return {
            ...player,
            resources: {
              ...player.resources,
              [tradeDetails.give]: player.resources[tradeDetails.give] + tradeDetails.giveAmount,
              [tradeDetails.receive]: player.resources[tradeDetails.receive] - tradeDetails.receiveAmount
            }
          };
        }
        return player;
      });

      return {
        ...prevState,
        players: updatedPlayers,
        resources: updatedPlayers.find(p => p.id === playerNation.id).resources
      };
    });
  };

  const renderScreen = () => {
    const currentPlayerData = gameState.players.find(p => p.id === playerNation?.id);
    
    if (!currentPlayerData && currentScreen !== 'nationSelection') {
      return <div>Loading player data...</div>;
    }

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
            className="p-4 bg-blue-500 dark:bg-blue-700 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-800 flex flex-col items-center"
          >
            <div className="text-6xl mb-2">{nation.flag}</div>
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
        return <CityManagement 
          cities={currentPlayerData.cities} 
          researchedTechs={gameState.researchedTechs}
          resources={gameState.resources}
          onBuild={handleBuild}
        />;
        case 'resourceManagement': 
        return <ResourceManagement 
          resources={currentPlayerData?.resources || {}}
          cities={currentPlayerData?.cities || []}
          onAllocateWorker={handleAllocateWorker}
        />;
      case 'diplomacy': 
        return <Diplomacy diplomacy={gameState.diplomacy} players={gameState.players} playerNation={playerNation} />;
      case 'technologyTree': 
        return <TechnologyTree 
          researchedTechs={gameState.researchedTechs}
          onResearch={handleResearch}
          resources={gameState.resources}
        />;
      case 'tradeSystem': 
        return <TradeSystem 
          resources={currentPlayerData.resources} 
          players={gameState.players} 
          playerNation={playerNation}
          onTrade={handleTrade}
        />;
      case 'militaryManagement': 
        return <MilitaryManagement 
          military={currentPlayerData.military} 
          researchedTechs={gameState.researchedTechs}
          resources={gameState.resources}
          onRecruit={handleRecruit}
        />;
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
              onClick={advanceTurn}
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

      {playerNation && gameState.resources && (
        <footer className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Resources</h2>
          <ul className="flex space-x-4">
            {Object.entries(gameState.resources).map(([resource, amount]) => (
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