import React, { useState, useEffect, useRef } from "react";
import decks from "./decks.json";
import "./style.css";

export default function App() {
  const [deckName, setDeckName] = useState(Object.keys(decks)[0]);
  const [cards, setCards] = useState(decks[deckName]);
  const [index, setIndex] = useState(0);
  const [showFront, setShowFront] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [streak, setStreak] = useState(0);
  const [hintLength, setHintLength] = useState(0);

  const touchStartX = useRef(null);

  useEffect(() => {
    setCards(decks[deckName]);
    setIndex(0);
    setShowFront(true);
    setShuffle(false);
    setHintLength(0);
  }, [deckName]);

  const card = cards[index] || { front: "No cards", back: "" };
  const progressPercent = Math.round(((index + 1) / cards.length) * 100);

  function nextCard() {
    setIndex((prev) => (prev + 1) % cards.length);
    setShowFront(true);
    setStreak((s) => s + 1);
    setHintLength(0);
  }

  function flipCard() {
    setShowFront((prev) => !prev);
  }

  function markDifficulty(level) {
    if (level === "hard" && cards.length > 1) {
      const reinjectPos = (index + 2) % cards.length;
      const newOrder = [...cards];
      const [c] = newOrder.splice(index, 1);
      newOrder.splice(reinjectPos, 0, c);
      setCards(newOrder);
      setShowFront(true);
    } else {
      nextCard();
    }
  }

  function giveHint() {
    if (!showFront) return; // only hint when front is showing
    if (hintLength < card.back.length) {
      setHintLength(hintLength + 1);
    } else {
      setHintLength(0); // reset if fully revealed
    }
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

  const hint = hintLength > 0 ? `${card.back.substring(0, hintLength)}${hintLength < card.back.length ? "..." : ""}` : "";

  return (
    <div className={`app ${darkMode ? "dark" : ""}`} style={{ width: "100%", minHeight: "100vh", paddingTop: "24px", paddingBottom: "24px" }}>
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
        </header>

        <div className="progress-wrap">
          <div className="progress">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

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
                {card.front}
                {hintLength > 0 && <div className="hint">💡 {hint}</div>}
              </div>
              <div className="back-side">{card.back}</div>
            </div>
          </div>
        </div>

        <div className="controls">
          <div className="difficulty-buttons">
            <button className="easy" onClick={() => markDifficulty("easy")}>😊 Easy</button>
            <button className="hard" onClick={() => markDifficulty("hard")}>🔥 Hard</button>
            <button className="hint-btn" onClick={giveHint}>💡 Hint</button>
          </div>

          <div className="footer">
            <button className="next-btn" onClick={nextCard}>Next ➡️</button>
            <div className="streak">🔥 <strong>{streak}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
