import React, { useState, useEffect, useRef } from "react";
import decks from "./decks.json";
import "./style.css";

export default function App() {
  const [deckName, setDeckName] = useState(Object.keys(decks)[0]);
  const [cards, setCards] = useState(decks[deckName]);
  const [index, setIndex] = useState(0);
  const [showFront, setShowFront] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [streak, setStreak] = useState(0);
  const [hintLength, setHintLength] = useState(0);
  const [shuffle, setShuffle] = useState(false);

  const touchStartX = useRef(null);

  useEffect(() => {
    setCards(decks[deckName]);
    setIndex(0);
    setShowFront(true);
    setHintLength(0);
    setStreak(0);
    setShuffle(false);
  }, [deckName]);

  const card = cards[index] || { front: "No cards", back: "" };

  function nextCard() {
    setIndex((prev) => (prev + 1) % cards.length);
    setShowFront(true);
    setHintLength(0);
    setStreak((s) => s + 1);
  }

  function flipCard() {
    setShowFront((prev) => !prev);
  }

  function giveHint() {
    if (!showFront) return;
    if (hintLength < card.back.length) {
      setHintLength(hintLength + 1);
    } else {
      setHintLength(0);
    }
  }

  function toggleShuffle() {
    setShuffle((s) => {
      const newVal = !s;
      if (newVal) {
        const copy = [...cards];
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        setCards(copy);
        setIndex(0);
      } else {
        setCards(decks[deckName]);
        setIndex(0);
      }
      return newVal;
    });
  }

  function onTouchStart(e) {
    if (!e.touches) return;
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e) {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;

    if (delta < -50) nextCard();
    else if (delta > 50) flipCard();
  }

  const hint = hintLength > 0
    ? `${card.back.substring(0, hintLength)}${hintLength < card.back.length ? "..." : ""}`
    : "";

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <div className="container">
        <header>
          <h1>✨ Swedish Practice ✨</h1>

          <div className="toolbar">
            <select value={deckName} onChange={(e) => setDeckName(e.target.value)}>
              {Object.keys(decks).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <button className="icon" onClick={() => setDarkMode((d) => !d)}>
              {darkMode ? "🌙" : "☀️"}
            </button>

            <button className="icon" onClick={toggleShuffle}>
              {shuffle ? "🔀" : "➡️"}
            </button>
          </div>

          <div className="progress-numbers">
            {index + 1} / {cards.length}
          </div>
        </header>

        <div className="card-area">
          <div
            className={`flashcard ${showFront ? "front" : "back"}`}
            onClick={flipCard}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            role="button"
            aria-label="Flashcard"
          >
            <div className="inner">
              <div className="front-side">
                <div className="swedish-word">{card.front}</div>
                {hintLength > 0 && <div className="hint">💡 {hint}</div>}
              </div>
              <div className="back-side">{card.back}</div>
            </div>
          </div>
        </div>

        <div className="controls">
          <button className="hint-btn" onClick={giveHint}>💡 Hint</button>
          <button className="next-btn" onClick={nextCard}>Next ➡️</button>
          <div className="streak">🔥 <strong>{streak}</strong></div>
        </div>
      </div>
    </div>
  );
}
