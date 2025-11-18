import React, { useEffect, useState } from "react";
import flashcardsData from "./flashcards.json";

const App = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hintLength, setHintLength] = useState(0);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    // Load flashcards from JSON
    setFlashcards(flashcardsData);
    setShuffledCards(shuffleArray(flashcardsData));
  }, []);

  const handleCardClick = () => setIsFlipped(!isFlipped);

  const handleNextCard = () => {
    setCurrentCardIndex((i) => (i + 1) % shuffledCards.length);
    setIsFlipped(false);
    setHintLength(0);
  };

  const handlePrevCard = () => {
    setCurrentCardIndex((i) => (i - 1 + shuffledCards.length) % shuffledCards.length);
    setIsFlipped(false);
    setHintLength(0);
  };

  const toggleHint = () => {
    const currentCard = shuffledCards[currentCardIndex];
    const maxHint = currentCard.english.length;

    setHintLength((h) => (h < maxHint ? h + 1 : 0));
  };

  const resetCard = () => {
    setIsFlipped(false);
    setHintLength(0);
  };

  const reshuffleCards = () => {
    setShuffledCards(shuffleArray(flashcards));
    setCurrentCardIndex(0);
    resetCard();
  };

  if (shuffledCards.length === 0) {
    return <div>Loading flashcards...</div>;
  }

  const currentCard = shuffledCards[currentCardIndex];
  const hint =
    hintLength > 0
      ? `${currentCard.english.substring(0, hintLength)}${hintLength < currentCard.english.length ? "..." : ""}`
      : "";

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Swedish Flashcards</h1>

      <div onClick={handleCardClick} style={{ cursor: "pointer", marginBottom: 20 }}>
        {!isFlipped ? (
          <div>
            <h2>🇸🇪 {currentCard.swedish}</h2>
            {hintLength > 0 && <p><strong>Hint:</strong> {hint}</p>}
          </div>
        ) : (
          <h2>🇬🇧 {currentCard.english}</h2>
        )}
      </div>

      <button onClick={handlePrevCard}>Previous</button>
      <button onClick={resetCard}>Reset</button>
      <button onClick={handleNextCard}>Next</button>
      <button onClick={reshuffleCards}>Reshuffle</button>

      <div style={{ marginTop: 20 }}>
        <button onClick={toggleHint}>{hintLength > 0 ? "More Hint" : "Show Hint"}</button>
      </div>

      <p style={{ marginTop: 20 }}>
        Card {currentCardIndex + 1} / {shuffledCards.length}
      </p>
    </div>
  );
};

export default App;
