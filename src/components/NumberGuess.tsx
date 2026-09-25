import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  RefreshCw,
  Hash,
  Heart,
  ArrowUp,
  ArrowDown,
  Target,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function NumberGuess({
  onBack,
  onLevelComplete,
}: {
  onBack: () => void;
  onLevelComplete?: (reward?: number) => void;
}) {
  const [currentLevel, setCurrentLevel] = useState(() => {
    const saved = localStorage.getItem("mindtest_numberguess_level");
    return saved ? parseInt(saved, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem("mindtest_numberguess_level", currentLevel.toString());
  }, [currentLevel]);
  const [targetNumber, setTargetNumber] = useState(0);
  const [guess, setGuess] = useState("");
  const [chancesLeft, setChancesLeft] = useState(10);
  const [history, setHistory] = useState<
    Array<{ guess: number; hint: string; distance: number }>
  >([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [rangeStr, setRangeStr] = useState("1-100");
  const inputRef = useRef<HTMLInputElement>(null);

  const initGame = (levelToStart: number) => {
    let min = 1;
    let max = 100;
    let chances = 10;

    if (levelToStart <= 10) {
      max = 20 + levelToStart * 5;
      chances = 10;
    } else if (levelToStart <= 30) {
      max = 100 + (levelToStart - 10) * 20;
      chances = 8;
    } else {
      max = 500 + (levelToStart - 30) * 50;
      chances = 6;
    }

    setTargetNumber(Math.floor(Math.random() * (max - min + 1)) + min);
    setChancesLeft(chances);
    setHistory([]);
    setGameOver(false);
    setWon(false);
    setGuess("");
    setRangeStr(`${min}-${max}`);
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    initGame(currentLevel);
  }, [currentLevel]);

  const getHint = (guessedNum: number, target: number) => {
    const diff = Math.abs(guessedNum - target);
    let hint = "";

    if (guessedNum > target) hint = "Lower";
    else if (guessedNum < target) hint = "Higher";

    let temphint = "";
    if (diff <= 5) temphint = "Very Close! 🔥";
    else if (diff <= 15) temphint = "Warm! ☀️";
    else temphint = "Cold ❄️";

    return { direction: hint, temp: temphint, diff };
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameOver || !guess) return;

    const num = parseInt(guess);
    if (isNaN(num)) return;

    if (num === targetNumber) {
      setWon(true);
      setGameOver(true);
      if (onLevelComplete) onLevelComplete(20); // Give 20 coins for number guess
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
      setHistory([
        { guess: num, hint: "You got it! 🎉", distance: 0 },
        ...history,
      ]);
    } else {
      const hintObj = getHint(num, targetNumber);
      setHistory([
        {
          guess: num,
          hint: `${hintObj.direction} (${hintObj.temp})`,
          distance: hintObj.diff,
        },
        ...history,
      ]);

      const newChances = chancesLeft - 1;
      setChancesLeft(newChances);

      if (newChances <= 0) {
        setGameOver(true);
      }
    }

    setGuess("");
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 text-gray-900 overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
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
              NUM_GUESS
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-600 font-bold">
              Level {currentLevel}
            </span>
          </div>
        </div>
        <div className="flex gap-4 items-center justify-end w-[88px]">
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-600 bg-cyan-50/50 px-2 py-1 rounded-sm font-bold whitespace-nowrap">
            MOVES: {history.length} / {history.length + chancesLeft}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-cyan-600" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 font-bold">
            Range:
          </span>
          <span className="font-mono text-xs text-cyan-700 bg-cyan-50 px-2 py-0.5 border border-cyan-200 rounded-sm font-bold">
            {rangeStr}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-1.5 rounded-sm transition-colors duration-300 ${i < chancesLeft ? "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-3">
          <AnimatePresence>
            {history.map((h, i) => (
              <motion.div
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                key={history.length - i}
                className={`p-4 flex items-center justify-between border rounded-sm shadow-sm ${
                  h.distance === 0
                    ? "bg-cyan-50 border-cyan-200 text-cyan-800 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                    : h.distance <= 5
                      ? "bg-orange-50 border-orange-200 text-orange-800"
                      : "bg-white border-gray-200 text-gray-600"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-mono font-black opacity-80 w-12 text-center">
                    #{String(h.guess).padStart(2, "0")}
                  </span>
                  <div className="h-8 w-px bg-current opacity-20"></div>
                  <span className="font-mono text-xs uppercase tracking-widest flex items-center gap-2 font-bold">
                    {h.hint.includes("Higher") && (
                      <ArrowUp className="w-4 h-4 text-cyan-600" />
                    )}
                    {h.hint.includes("Lower") && (
                      <ArrowDown className="w-4 h-4 text-orange-500" />
                    )}
                    {h.hint}
                  </span>
                </div>
              </motion.div>
            ))}

            {history.length === 0 && !gameOver && (
              <motion.div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4 opacity-50">
                <Hash className="w-16 h-16 opacity-30" />
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] font-bold">
                  Awaiting Input Sequence
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-auto">
          {gameOver ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-8 flex flex-col items-center justify-center border rounded-md shadow-sm ${won ? "bg-cyan-50 border-cyan-200" : "bg-red-50 border-red-200"}`}
            >
              <h3
                className={`text-2xl font-black tracking-tighter mb-2 ${won ? "text-cyan-700" : "text-red-700"}`}
              >
                {won ? "COMPLETED" : "GAME OVER"}
              </h3>
              {!won && (
                <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-6 font-bold">
                  The number was{" "}
                  <span className="text-gray-900 text-base">
                    {targetNumber}
                  </span>
                </p>
              )}
              {won && (
                <p className="text-cyan-600 font-mono text-[10px] uppercase tracking-widest mb-6 font-bold">
                  Level {currentLevel} cleared!
                </p>
              )}
              <div className="flex gap-4">
                <button
                  onClick={() => initGame(currentLevel)}
                  className={`flex items-center gap-2 px-8 py-3 font-mono text-[10px] uppercase tracking-widest transition-colors font-bold shadow-sm ${won ? "bg-cyan-100 hover:bg-cyan-200 border border-cyan-300 text-cyan-800" : "bg-red-100 hover:bg-red-200 border border-red-300 text-red-800"}`}
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
                {won && currentLevel < 50 && (
                  <button
                    onClick={() => setCurrentLevel((l) => l + 1)}
                    className="flex items-center gap-2 px-8 py-3 font-mono text-[10px] uppercase tracking-widest transition-colors font-bold shadow-sm bg-cyan-600 hover:bg-cyan-700 text-white rounded-sm"
                  >
                    Next Level
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <form
              onSubmit={handleGuess}
              className="relative flex gap-3 h-16 w-full"
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 text-cyan-600 font-mono font-bold">
                &gt;
              </div>
              <input
                ref={inputRef}
                type="number"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="  ENTER NUMBER"
                className="flex-1 bg-white border border-gray-300 pl-10 pr-6 py-4 text-xl font-mono text-cyan-800 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all placeholder:text-gray-400 shadow-sm rounded-sm"
                disabled={gameOver}
                autoFocus
              />
              <button
                type="submit"
                disabled={!guess}
                className="bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400 text-cyan-700 px-10 font-mono text-[12px] uppercase tracking-[0.2em] transition-all hover:shadow-[0_4px_15px_rgba(6,182,212,0.15)] font-bold shadow-sm rounded-sm"
              >
                EXECUTE
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
