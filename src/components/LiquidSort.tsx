import React, { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw, Undo2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const COLORS = [
  "bg-rose-400",
  "bg-sky-400",
  "bg-emerald-400",
  "bg-amber-400",
  "bg-indigo-400",
  "bg-fuchsia-400",
  "bg-teal-400",
  "bg-orange-400",
  "bg-lime-400",
  "bg-cyan-400",
  "bg-violet-400",
  "bg-pink-400",
  "bg-yellow-400",
  "bg-red-400",
];

const TUBE_CAPACITY = 4;

type Tube = string[];

export default function LiquidSort({
  onBack,
  onLevelComplete,
}: {
  onBack: () => void;
  onLevelComplete?: (reward?: number) => void;
}) {
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem("mindtest_liquidsort_level");
    return saved ? parseInt(saved, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem("mindtest_liquidsort_level", level.toString());
  }, [level]);
  const [tubes, setTubes] = useState<Tube[]>([]);
  const [initialTubesState, setInitialTubesState] = useState<Tube[]>([]);
  const [selectedTube, setSelectedTube] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [history, setHistory] = useState<Tube[][]>([]);

  useEffect(() => {
    generateLevel(level);
  }, [level]);

  const generateLevel = (currentLevel: number) => {
    // Determine difficulty setup for 50 levels
    let numColors = 3;
    let emptyTubes = 2; // Always have 2 empty tubes to allow sorting comfortably

    if (currentLevel <= 10) {
      numColors = 3 + Math.floor(currentLevel / 3); // 3 to 6 colors
    } else if (currentLevel <= 30) {
      numColors = 6 + Math.floor((currentLevel - 10) / 5); // 6 to 10 colors
    } else {
      numColors = 10 + Math.floor((currentLevel - 30) / 5); // 10 to 14 colors
    }

    numColors = Math.min(numColors, COLORS.length);
    const numTubes = numColors + emptyTubes;

    // Create sorted tubes first
    const levelColors = COLORS.slice(0, numColors);
    let allLiquids: string[] = [];
    levelColors.forEach((color) => {
      for (let i = 0; i < TUBE_CAPACITY; i++) {
        allLiquids.push(color);
      }
    });

    // Shuffle liquids
    for (let i = allLiquids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allLiquids[i], allLiquids[j]] = [allLiquids[j], allLiquids[i]];
    }

    // Distribute into tubes
    const initialTubes: Tube[] = Array(numTubes).fill([]);
    initialTubes.forEach((_, index) => {
      if (index < numColors) {
        initialTubes[index] = allLiquids.splice(0, TUBE_CAPACITY);
      } else {
        initialTubes[index] = [];
      }
    });

    setInitialTubesState(initialTubes.map((t) => [...t]));
    setTubes(initialTubes.map((t) => [...t]));
    setHistory([initialTubes.map((t) => [...t])]);
    setMoves(0);
    setIsWon(false);
    setSelectedTube(null);
  };

  const handleTubeClick = (index: number) => {
    if (isWon) return;

    if (selectedTube === null) {
      if (tubes[index].length > 0) {
        setSelectedTube(index);
      }
    } else {
      if (selectedTube === index) {
        setSelectedTube(null); // Deselect
      } else {
        tryPour(selectedTube, index);
      }
    }
  };

  const tryPour = (fromIdx: number, toIdx: number) => {
    const fromTube = tubes[fromIdx];
    const toTube = tubes[toIdx];

    if (fromTube.length === 0) {
      setSelectedTube(null);
      return;
    }

    const colorToPour = fromTube[fromTube.length - 1];

    if (toTube.length > 0 && toTube[toTube.length - 1] !== colorToPour) {
      setSelectedTube(null);
      return; // Cannot pour onto different color // play error sound?
    }

    if (toTube.length >= TUBE_CAPACITY) {
      setSelectedTube(null);
      return; // Tube is full
    }

    // Determine how much we can pour
    let amountToPour = 0;
    for (let i = fromTube.length - 1; i >= 0; i--) {
      if (
        fromTube[i] === colorToPour &&
        toTube.length + amountToPour < TUBE_CAPACITY
      ) {
        amountToPour++;
      } else {
        break;
      }
    }

    const newTubes = tubes.map((t) => [...t]);
    const pouredLiquids = newTubes[fromIdx].splice(
      newTubes[fromIdx].length - amountToPour,
      amountToPour,
    );
    newTubes[toIdx].push(...pouredLiquids);

    setHistory((prev) => [...prev, newTubes.map((t) => [...t])]);
    setTubes(newTubes);
    setMoves((m) => m + 1);
    setSelectedTube(null);
    checkWin(newTubes);
  };

  const undoMove = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current state
      setTubes(newHistory[newHistory.length - 1].map((t) => [...t]));
      setHistory(newHistory);
      setMoves((m) => Math.max(0, m - 1));
      setSelectedTube(null);
    }
  };

  const checkWin = (currentTubes: Tube[]) => {
    const isComplete = currentTubes.every((tube) => {
      if (tube.length === 0) return true;
      if (tube.length < TUBE_CAPACITY) return false;
      const firstColor = tube[0];
      return tube.every((color) => color === firstColor);
    });

    if (isComplete) {
      setIsWon(true);
      if (onLevelComplete) onLevelComplete(25); // 25 coins for liquid sort
    }
  };

  const nextLevel = () => {
    setLevel((l) => l + 1);
  };

  const restartLevel = () => {
    setTubes(initialTubesState.map((t) => [...t]));
    setHistory([initialTubesState.map((t) => [...t])]);
    setMoves(0);
    setIsWon(false);
    setSelectedTube(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden border border-slate-800">
      <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 shrink-0">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-800 transition-colors flex items-center gap-2 text-slate-400 hover:text-white rounded-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
            Back
          </span>
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold flex items-center gap-2 text-teal-400">
            <span>🧪</span> Liquid Sort
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-widest text-teal-500 font-bold">
            Level {level}
          </span>
        </div>
        <div className="flex gap-4 font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          <div className="text-right flex flex-col items-end gap-1">
            Moves
            <br />
            <span className="text-slate-100 text-sm whitespace-nowrap">
              {moves} / {20 + level * 5}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col items-center justify-center relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 overflow-y-auto w-full">
        {isWon && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md shadow-sm gap-4">
            <h3 className="text-4xl font-black text-teal-400 tracking-tight drop-shadow-lg">
              LEVEL CLEARED!
            </h3>
            <button
              onClick={nextLevel}
              className="px-8 py-4 bg-teal-500 text-slate-950 font-mono text-[12px] uppercase tracking-widest hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/20 rounded-sm font-bold mt-4"
            >
              Next Level
            </button>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 max-w-3xl w-full perspective-1000">
          {tubes.map((tube, index) => (
            <div
              key={index}
              onClick={() => handleTubeClick(index)}
              className={`relative flex flex-col-reverse justify-start w-12 h-40 sm:w-16 sm:h-48 border-[3px] border-t-0 rounded-b-3xl cursor-pointer transition-all duration-300 overflow-hidden bg-slate-800/40 backdrop-blur-sm shadow-inner
                ${
                  selectedTube === index
                    ? "border-teal-400 -translate-y-6 shadow-[0_10px_30px_rgba(45,212,191,0.3)]"
                    : "border-slate-600 hover:-translate-y-2 hover:border-slate-500"
                }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none z-10" />
              {tube.map((color, i) => (
                <motion.div
                  key={`${index}-${i}-${color}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${100 / TUBE_CAPACITY}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`${color} w-full opacity-90 backdrop-blur-sm`}
                  style={{ height: `${100 / TUBE_CAPACITY}%` }}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="mt-16 flex gap-4">
          <button
            onClick={undoMove}
            disabled={history.length <= 1 || isWon}
            className="px-6 py-3 bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-widest font-bold rounded-sm shadow-sm"
          >
            <Undo2 className="w-4 h-4" /> Undo
          </button>
          <button
            onClick={restartLevel}
            disabled={isWon}
            className="px-6 py-3 bg-slate-800 border border-slate-700 text-rose-400 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-widest font-bold rounded-sm shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> Restart
          </button>
        </div>
      </div>
    </div>
  );
}
