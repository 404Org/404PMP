import React, { useState, useEffect } from 'react';
import { Search, Coffee} from 'lucide-react';

const Error404 = () => {
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [searchMessage, setSearchMessage] = useState('');
  //const [debugAttempts, setDebugAttempts] = useState(0);
  const [coffeeLevel, setCoffeeLevel] = useState(0);
  const [coffeeMessage, setCoffeeMessage] = useState('Developer needs coffee! ☕');

  const coffeeMessages = [
    "Developer needs coffee! ☕",
    "Caffeine levels critical! ⚠️",
    "Brain.exe starting... ⌛",
    "Code quality improving... 📈",
    "Developer approaching optimal caffeine levels! 🚀",
    "WARNING: Developer over-caffeinated! 🤪",
  ];

  const searchResponses = {
    default: [
      "Looking everywhere... even in the recycle bin 🗑️",
      "Have you tried turning it off and on again?",
      "Loading... please wait... still loading... coffee break? ☕",
      "Error 404: Sense of direction not found 🧭",
    ],
    keywords: {
      'help': [
        "Have you tried Stack Overflow? They'll mark it as duplicate 😅",
        "Help page is also lost. The irony! 🎭",
      ],
      'coffee': [
        "Did someone say COFFEE? *developer perks up* ☕",
        "ERROR: Coffee.exe stopped working 😱",
        "Searching coffee machine coordinates... 📍",
      ],
      // ... other keyword responses remain the same
    }
  };

  const handleCoffeeClick = () => {
    const newLevel = Math.min(coffeeLevel + 20, 100);
    setCoffeeLevel(newLevel);
    
    // Update coffee message based on level
    const messageIndex = Math.floor(newLevel / 20);
    setCoffeeMessage(coffeeMessages[messageIndex]);

    // Easter egg when reaching max coffee
    if (newLevel === 100) {
      setTimeout(() => {
        setSearchMessage("MAXIMUM COFFEE ACHIEVED! Developer now speaks in binary! 01001000 01101001!");
      }, 500);
    }
  };

  useEffect(() => {
    if (searchText) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        // Check for coffee-related searches
        if (searchText.toLowerCase().includes('coffee')) {
          setCoffeeLevel(prev => Math.min(prev + 10, 100));
        }
        setSearchMessage(generateSearchResponse(searchText));
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
      setSearchMessage('');
    }
    // eslint-disable-next-line
  }, [searchText]);

  const generateSearchResponse = (search) => {
    const lowercaseSearch = search.toLowerCase();
    for (const [keyword, responses] of Object.entries(searchResponses.keywords)) {
      if (lowercaseSearch.includes(keyword)) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    return searchResponses.default[Math.floor(Math.random() * searchResponses.default.length)];
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-xl w-full space-y-6">
        <div className="flex justify-between items-center">
          <h1 
            className="text-8xl font-bold text-blue-600 cursor-pointer transition-transform duration-700 ease-in-out"
            style={{ transform: `rotate(${rotation}deg)` }}
            onClick={() => setRotation(rotation + 360)}
          >
            404
          </h1>
          
          {/* Coffee meter always visible in top right */}
          <div className="flex flex-col items-center space-y-2">
            <Coffee 
              className={`w-8 h-8 ${coffeeLevel > 80 ? 'animate-bounce' : ''}`}
              color={coffeeLevel > 60 ? '#7C3AED' : '#6B7280'}
            />
            <div className="text-sm font-medium mb-1">Caffeine Level</div>
          </div>
        </div>

        {/* Caffeine progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-gradient-to-r from-yellow-800 via-purple-600 to-purple-900 rounded-full h-4 transition-all duration-500"
            style={{ width: `${coffeeLevel}%` }}
          />
        </div>
        
        <div className="text-center text-sm font-medium text-gray-600">
          {coffeeMessage}
        </div>

        <button
          onClick={handleCoffeeClick}
          className={`w-full px-4 py-2 ${
            coffeeLevel >= 100 
              ? 'bg-purple-600 animate-pulse' 
              : 'bg-yellow-800 hover:bg-yellow-900'
          } text-white rounded-full transition-all duration-300 flex items-center justify-center gap-2`}
        >
          <Coffee className="h-4 w-4" />
          {coffeeLevel >= 100 ? 'MAXIMUM CAFFEINE!' : 'Add Coffee ☕'}
        </button>

        <div className="text-center space-y-2">
          <p className="text-2xl font-semibold text-gray-800">
            Page Not Found (Just Like Our Team Name! 😅)
          </p>
          <p className="text-gray-600">
            {coffeeLevel < 40 
              ? "Warning: Low caffeine levels detected! Developer may respond with bugs 🐛" 
              : "Developer properly caffeinated! Time to debug! 🚀"}
          </p>
        </div>

        <div className="relative">
          <div className="flex items-center border-2 rounded-full px-4 py-2 focus-within:border-blue-500">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="w-full px-3 py-1 outline-none"
              placeholder={coffeeLevel > 80 ? "TYPING VERY FAST!!!" : "Search for literally anything..."}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>

        {isSearching && (
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <div className="text-center text-gray-600">
              {searchMessage}
            </div>
          </div>
        )}

        {coffeeLevel === 100 && (
          <div className="text-center text-purple-600 font-semibold animate-pulse">
            DEVELOPER HAS ACHIEVED COFFEE NIRVANA! 🧘‍♂️✨
          </div>
        )}

        {coffeeLevel > 60 && searchText.length > 15 && (
          <div className="text-center text-green-500">
            Typing speed increased by 1000% due to caffeine! ⚡
          </div>
        )}
      </div>
    </div>
  );
};

export default Error404;