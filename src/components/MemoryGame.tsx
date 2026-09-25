import React, { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw, FastForward, Check } from "lucide-react";

const ICONS = [
  "🦄",
  "🐉",
  "🦖",
  "👽",
  "🤖",
  "👻",
  "🤡",
  "👹",
  "👺",
  "🎃",
  "👾",
  "🧚",
  "🦸",
  "🦹",
  "🧙",
  "🧛",
  "🧟",
  "🧞",
  "🧜",
  "🧝",
  "⛄",
  "☄️",
  "🪐",
  "⚡",
];

export default function MemoryGame({
  onBack,
  onLevelComplete,
}: {
  onBack: () => void;
  onLevelComplete?: (reward?: number) => void;
}) {
  const [cards, setCards] = useState<number[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem("mindtest_memorygame_level");
    return saved ? parseInt(saved, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem("mindtest_memorygame_level", level.toString());
  }, [level]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    initGame(level);
  }, [level]);

  const initGame = (currentLevel: number) => {
    let pairCount = 3;
    if (currentLevel <= 10) {
      pairCount = Math.floor(3 + currentLevel * 0.3); // 3 to 6
    } else if (currentLevel <= 30) {
      pairCount = Math.floor(6 + (currentLevel - 10) * 0.3); // 6 to 12
    } else {
      pairCount = Math.floor(12 + (currentLevel - 30) * 0.3); // 12 to 18
    }

    pairCount = Math.min(pairCount, ICONS.length);

    // Select icon indices for this level
    const allIndices = Array.from({ length: ICONS.length }, (_, i) => i);
    const shuffledIndices = allIndices.sort(() => Math.random() - 0.5);
    const selectedIndices = shuffledIndices.slice(0, pairCount);
    const shuffled = [...selectedIndices, ...selectedIndices].sort(
      () => Math.random() - 0.5,
    );

    setCards(shuffled);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setGameComplete(false);
  };

  const restartGame = () => {
    initGame(level);
  };

  const nextLevel = () => {
    setLevel((l) => Math.min(50, l + 1));
  };

  const handleFlip = (idx: number) => {
    if (flipped.length === 2 || flipped.includes(idx) || solved.includes(idx))
      return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setSolved([...solved, ...newFlipped]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const isLevelComplete = solved.length === cards.length && cards.length > 0;

  useEffect(() => {
    if (isLevelComplete && onLevelComplete) {
      onLevelComplete(30); // Give 30 coins for memory game
    }
  }, [isLevelComplete]);

  return (
    <div className="flex flex-col h-full bg-gray-50 text-gray-900 overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-500 hover:text-gray-900 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-gray-700 font-bold">
            Back
          </span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-sm bg-cyan-500 animate-pulse"></div>
          <div className="flex flex-col">
            <h2 className="text-xl font-black tracking-tight text-gray-900 uppercase">
              MEM_LINK
            </h2>
          </div>
        </div>
        <div className="flex gap-4 items-center justify-end">
          <div className="text-right flex flex-col items-end gap-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-700 bg-cyan-50 px-2 py-1 border border-cyan-200 rounded-sm font-bold">
              LEVEL: {level}/50
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-600 bg-cyan-50/50 px-2 py-1 rounded-sm font-bold">
              MOVES: {moves} / {15 + level * 5}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 flex flex-col items-center justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)] pointer-events-none"></div>

        {gameComplete ? (
          <div className="text-center bg-white border border-gray-200 p-12 rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.05)] relative overflow-hidden z-10 w-full max-w-md">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-cyan-50 to-transparent"></div>
            <h3 className="text-3xl font-black text-cyan-600 mb-2 tracking-tight filter drop-shadow-sm">
              SYSTEM OVERRIDE SUCCESS
            </h3>
            <p className="font-mono text-gray-500 text-[11px] uppercase tracking-[0.2em] mb-10 font-bold">
              All 50 Matrix Levels Cleared!
            </p>

            <button
              onClick={() => {
                setLevel(1);
                initGame(1);
              }}
              className="px-10 py-4 bg-cyan-50 border border-cyan-200 text-cyan-700 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-cyan-100 mx-auto flex items-center gap-3 transition-all hover:shadow-[0_4px_15px_rgba(6,182,212,0.15)] font-bold shadow-sm"
            >
              <RefreshCw className="w-4 h-4" /> Restart Matrix
            </button>
          </div>
        ) : isLevelComplete ? (
          <div className="text-center bg-white border border-gray-200 p-12 rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.05)] relative overflow-hidden z-10 w-full max-w-md">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-cyan-50 to-transparent"></div>
            <h3 className="text-3xl font-black text-cyan-600 mb-2 tracking-tight filter drop-shadow-sm">
              LEVEL {level} CLEARED
            </h3>
            <p className="font-mono text-gray-500 text-[11px] uppercase tracking-[0.2em] mb-10 font-bold">
              Memory Matrix Synchronized
            </p>

            <button
              onClick={level < 50 ? nextLevel : () => setGameComplete(true)}
              className="px-10 py-4 bg-cyan-50 border border-cyan-200 text-cyan-700 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-cyan-100 mx-auto flex items-center gap-3 transition-all hover:shadow-[0_4px_15px_rgba(6,182,212,0.15)] font-bold shadow-sm"
            >
              {level < 50 ? (
                <FastForward className="w-4 h-4" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {level < 50 ? "Initialize Next Level" : "Complete Sequence"}
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-3 md:gap-4 w-full max-w-2xl z-10 ${cards.length <= 16 ? "grid-cols-4 max-w-md" : cards.length <= 24 ? "grid-cols-4 md:grid-cols-6" : "grid-cols-5 md:grid-cols-6"}`}
          >
            {cards.map((card, idx) => {
              const isRevealed = flipped.includes(idx) || solved.includes(idx);
              const isSolved = solved.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleFlip(idx)}
                  className={`relative aspect-square text-3xl md:text-4xl flex items-center justify-center border rounded-md transition-all duration-300 transform-gpu preserve-3d group shadow-sm ${
                    isRevealed
                      ? isSolved
                        ? "bg-cyan-50 border-cyan-200 text-gray-900 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]"
                        : "bg-white border-cyan-400 text-gray-900 shadow-[0_0_15px_rgba(6,182,212,0.2)] scale-105 z-10"
                      : "bg-gray-100 border-gray-300 hover:border-cyan-300 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`transition-all duration-300 ${isRevealed ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
                  >
                    {isRevealed ? ICONS[card] : ""}
                  </div>
                  {!isRevealed && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-30 transition-opacity">
                      <div className="w-2 h-2 rounded-sm bg-cyan-600 bg-opacity-50"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
