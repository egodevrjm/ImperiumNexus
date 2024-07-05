// src/app/gameData.js
export const nations = [
    {
      id: 'rome',
      name: 'Roman Empire',
      flag: '🇮🇹', // Using Italy's flag as a stand-in for Rome
      capital: 'Rome',
      cities: ['Rome', 'Neapolis', 'Mediolanum', 'Ravenna', 'Aquileia', 'Capua', 'Tarentum', 'Syracusae', 'Carthage', 'Lugdunum', 'Londinium', 'Byzantium'],
      specialUnit: 'Legion',
      bonus: 'Roads: +25% movement speed',
    },
    {
      id: 'china',
      name: 'Han Dynasty',
      flag: '🇨🇳',
      capital: 'Chang\'an',
      cities: ['Chang\'an', 'Luoyang', 'Handan', 'Linzi', 'Chengdu', 'Nanjing', 'Guangzhou', 'Hangzhou', 'Xiangyang', 'Kaifeng', 'Wuhan', 'Xianyang'],
      specialUnit: 'Chu-ko-nu',
      bonus: 'Great Wall: +50% city defense',
    },
    {
      id: 'persia',
      name: 'Persian Empire',
      flag: '🇮🇷', // Using Iran's flag as a stand-in for Persia
      capital: 'Persepolis',
      cities: ['Persepolis', 'Susa', 'Ecbatana', 'Pasargadae', 'Babylon', 'Ctesiphon', 'Isfahan', 'Sardis', 'Tarsus', 'Halicarnassus', 'Petra', 'Damascus'],
      specialUnit: 'Immortal',
      bonus: 'Royal Road: +25% trade income',
    },
    {
      id: 'egypt',
      name: 'Egyptian Empire',
      flag: '🇪🇬',
      capital: 'Memphis',
      cities: ['Memphis', 'Thebes', 'Alexandria', 'Giza', 'Heliopolis', 'Luxor', 'Aswan', 'Abydos', 'Avaris', 'Tanis', 'Edfu', 'Amarna'],
      specialUnit: 'War Chariot',
      bonus: 'Pyramids: +25% wonder construction speed',
    },
    {
      id: 'greece',
      name: 'Greek City-States',
      flag: '🇬🇷',
      capital: 'Athens',
      cities: ['Athens', 'Sparta', 'Thebes', 'Corinth', 'Delphi', 'Argos', 'Olympia', 'Mycenae', 'Rhodes', 'Miletus', 'Syracuse', 'Byzantium'],
      specialUnit: 'Hoplite',
      bonus: 'Philosophers: +25% science output',
    },
    {
      id: 'england',
      name: 'England',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      capital: 'London',
      cities: ['London', 'York', 'Canterbury', 'Winchester', 'Norwich', 'Bristol', 'Oxford', 'Cambridge', 'Manchester', 'Liverpool', 'Birmingham', 'Leeds'],
      specialUnit: 'Longbowman',
      bonus: 'Naval Empire: +25% ship movement speed',
    },
  ];
  
  export const getRandomNation = (exclude = []) => {
    const availableNations = nations.filter(nation => !exclude.includes(nation.id));
    return availableNations[Math.floor(Math.random() * availableNations.length)];
  };
  
  export const initialResources = {
    gold: 1000,
    food: 500,
    wood: 300,
    stone: 200,
    iron: 100,
  };
  
  export const initializeNationCities = (nation) => {
    const capital = {
      name: nation.capital,
      population: 1000000,
      buildings: ['Palace', 'Granary', 'Walls'],
      isCapital: true
    };
  
    const secondCity = {
      name: nation.cities.find(city => city !== nation.capital),
      population: 500000,
      buildings: ['Granary', 'Market'],
      isCapital: false
    };
  
    return [capital, secondCity];
  };
  

  export const technologies = [
    {
      id: 'writing',
      name: 'Writing',
      cost: 100,
      prerequisites: [],
      effects: {
        buildings: ['library'],
        units: [],
        bonuses: { science: 1.1 } // 10% increase in science output
      }
    },
    {
      id: 'bronzeWorking',
      name: 'Bronze Working',
      cost: 150,
      prerequisites: [],
      effects: {
        buildings: ['barracks'],
        units: ['spearman'],
        bonuses: { militaryStrength: 1.1 } // 10% increase in military strength
      }
    },
    {
      id: 'ironWorking',
      name: 'Iron Working',
      cost: 200,
      prerequisites: ['bronzeWorking'],
      effects: {
        buildings: ['forge'],
        units: ['swordsman'],
        bonuses: { militaryStrength: 1.2 } // 20% increase in military strength
      }
    },
    {
      id: 'mathematics',
      name: 'Mathematics',
      cost: 180,
      prerequisites: ['writing'],
      effects: {
        buildings: ['university'],
        units: ['catapult'],
        bonuses: { science: 1.2, militaryStrength: 1.1 }
      }
    },
    // Add more technologies as needed
  ];


export const buildings = [
    { id: 'library', name: 'Library', cost: 100, effects: { science: 2 } },
    { id: 'barracks', name: 'Barracks', cost: 120, effects: { militaryStrength: 2 } },
    { id: 'forge', name: 'Forge', cost: 150, effects: { production: 2, militaryStrength: 1 } },
    { id: 'university', name: 'University', cost: 200, effects: { science: 4 } },
    // Add more buildings as needed
  ];
  
  export const units = [
    { id: 'warrior', name: 'Warrior', strength: 10, cost: 50 },
    { id: 'spearman', name: 'Spearman', strength: 15, cost: 75 },
    { id: 'swordsman', name: 'Swordsman', strength: 20, cost: 100 },
    { id: 'catapult', name: 'Catapult', strength: 25, cost: 150 },
    // Add more units as needed
  ];


  export const getAvailableTechnologies = (researchedTechs = []) => {
    if (!Array.isArray(researchedTechs)) {
      console.warn('researchedTechs is not an array. Returning all technologies.');
      return technologies;
    }
    return technologies.filter(tech => 
      !researchedTechs.includes(tech.id) && 
      tech.prerequisites.every(prereq => researchedTechs.includes(prereq))
    );
  };
  
  export const getAvailableBuildings = (researchedTechs = []) => {
    if (!Array.isArray(researchedTechs)) {
      console.warn('researchedTechs is not an array. Returning all buildings.');
      return buildings;
    }
    const unlockedBuildings = researchedTechs.flatMap(techId => 
      technologies.find(t => t.id === techId)?.effects?.buildings || []
    );
    return buildings.filter(building => unlockedBuildings.includes(building.id));
  };
  
  export const getAvailableUnits = (researchedTechs = []) => {
    if (!Array.isArray(researchedTechs)) {
      console.warn('researchedTechs is not an array. Returning all units.');
      return units;
    }
    const unlockedUnits = researchedTechs.flatMap(techId => 
      technologies.find(t => t.id === techId)?.effects?.units || []
    );
    return units.filter(unit => unlockedUnits.includes(unit.id));
  };
    