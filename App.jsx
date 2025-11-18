import React, { useState, useEffect } from 'react';

const App = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hintLength, setHintLength] = useState(0);

  // Mock data for Swedish-English flashcards
  const mockFlashcards = [
    { swedish: "Hävda", english: "Claim" },
    { swedish: "Förstå", english: "Understand" },
    { swedish: "Skapa", english: "Create" },
    { swedish: "Lösa", english: "Solve" },
    { swedish: "Utveckla", english: "Develop" },
    { swedish: "Analysera", english: "Analyze" },
    { swedish: "Implementera", english: "Implement" },
    { swedish: "Optimera", english: "Optimize" },
    { swedish: "Kommunicera", english: "Communicate" },
    { swedish: "Innovativ", english: "Innovative" },
    { swedish: "Effektiv", english: "Effective" },
    { swedish: "Strategi", english: "Strategy" },
    { swedish: "Resultat", english: "Result" },
    { swedish: "Kvalitet", english: "Quality" },
    { swedish: "Inspirera", english: "Inspire" }
  ];

  // Function to shuffle array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    // Simulate loading from JSON file and shuffle cards
    setFlashcards(mockFlashcards);
    setShuffledCards(shuffleArray(mockFlashcards));
  }, []);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % shuffledCards.length);
    setIsFlipped(false);
    setHintLength(0);
  };

  const handlePrevCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + shuffledCards.length) % shuffledCards.length);
    setIsFlipped(false);
    setHintLength(0);
  };

  const toggleHint = () => {
    const currentCard = shuffledCards[currentCardIndex];
    const maxHintLength = currentCard.english.length;
    
    if (hintLength < maxHintLength) {
      setHintLength(hintLength + 1);
    } else {
      setHintLength(0); // Reset hint when it reaches the full word
    }
  };

  const resetCard = () => {
    setIsFlipped(false);
    setHintLength(0);
  };

  const reshuffleCards = () => {
    setShuffledCards(shuffleArray(flashcards));
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setHintLength(0);
  };

  if (shuffledCards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading flashcards...</div>
      </div>
    );
  }

  const currentCard = shuffledCards[currentCardIndex];
  const hint = hintLength > 0 ? `${currentCard.english.substring(0, hintLength)}${hintLength < currentCard.english.length ? '...' : ''}` : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Swedish Flashcards</h1>
          <p className="text-lg text-gray-600">Click on cards to flip and reveal translations</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full px-6 py-2 shadow-md">
            <span className="text-gray-700 font-medium">
              Card {currentCardIndex + 1} of {shuffledCards.length}
            </span>
          </div>
        </div>

        {/* Flashcard Container */}
        <div className="flex justify-center mb-8">
          <div 
            className="relative w-full max-w-md h-80 cursor-pointer perspective-1000"
            onClick={handleCardClick}
          >
            <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              {/* Front of card (Swedish) */}
              <div className="absolute inset-0 w-full h-full backface-hidden">
                <div className="bg-white rounded-2xl shadow-xl h-full flex flex-col items-center justify-center p-8 border-2 border-blue-200 hover:border-blue-300 transition-colors duration-300">
                  <div className="text-sm text-blue-600 font-semibold mb-4 uppercase tracking-wider">
                    Swedish
                  </div>
                  <div className="text-5xl font-bold text-gray-800 mb-6 text-center">
                    {currentCard.swedish}
                  </div>
                  {hintLength > 0 && (
                    <div className="bg-blue-50 rounded-lg px-4 py-2 mb-4 border border-blue-200">
                      <span className="text-lg font-mono text-blue-700">Hint: {hint}</span>
                    </div>
                  )}
                  <div className="text-gray-500 text-sm">
                    Click to reveal English translation
                  </div>
                </div>
              </div>

              {/* Back of card (English) */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl h-full flex flex-col items-center justify-center p-8 text-white">
                  <div className="text-sm font-semibold mb-4 uppercase tracking-wider opacity-90">
                    English
                  </div>
                  <div className="text-5xl font-bold mb-6 text-center">
                    {currentCard.english}
                  </div>
                  <div className="text-indigo-100 text-sm">
                    Click to see Swedish word
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center space-y-4">
          {/* Navigation Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={handlePrevCard}
              className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              ← Previous
            </button>
            
            <button
              onClick={resetCard}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Reset Card
            </button>
            
            <button
              onClick={handleNextCard}
              className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Next →
            </button>
            
            <button
              onClick={reshuffleCards}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Reshuffle
            </button>
          </div>

          {/* Hint Button */}
          <button
            onClick={toggleHint}
            className={`font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              hintLength > 0
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white hover:shadow-lg focus:ring-yellow-500' 
                : 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 hover:shadow-lg focus:ring-yellow-500'
            }`}
          >
            {hintLength > 0 ? `Hint (${hintLength}/${currentCard.english.length})` : 'Show Hint'}
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-white rounded-lg shadow-md p-6 max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">How to use:</h3>
            <ul className="text-gray-600 space-y-2 text-left">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Click on the flashcard to flip between Swedish and English
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Use the navigation buttons to move between cards
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Click "Show Hint" repeatedly to reveal one letter at a time
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Cards appear in random order - use "Reshuffle" to change the order
              </li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default App;