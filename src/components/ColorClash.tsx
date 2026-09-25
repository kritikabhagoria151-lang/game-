import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, RefreshCw, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const COLORS = [
  { name: "RED", hex: "#EF4444", tailwindText: "text-red-500" },
  { name: "BLUE", hex: "#3B82F6", tailwindText: "text-blue-500" },
  { name: "GREEN", hex: "#10B981", tailwindText: "text-green-500" },
  { name: "YELLOW", hex: "#EAB308", tailwindText: "text-yellow-500" },
  { name: "PURPLE", hex: "#A855F7", tailwindText: "text-purple-500" },
  { name: "ORANGE", hex: "#F97316", tailwindText: "text-orange-500" },
];

const GAME_DURATION = 30; // seconds

export default function ColorClash({
  onBack,
  onLevelComplete,
}: {
  onBack: () => void;
  onLevelComplete?: (reward?: number) => void;
}) {
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem("mindtest_colorclash_level");
    return saved ? parseInt(saved, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem("mindtest_colorclash_level", level.toString());
  }, [level]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const [currentWord, setCurrentWord] = useState(COLORS[0]);
  const [currentColor, setCurrentColor] = useState(COLORS[0]);

  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const getLevelConfig = (lvl: number) => {
    if (lvl <= 10) return { time: 30, target: 5 + lvl };
    if (lvl <= 30)
      return { time: 25, target: 15 + Math.floor((lvl - 10) * 1.5) };
    return { time: 20, target: 45 + (lvl - 30) * 2 };
  };

  const startGame = (startLevel: number = level) => {
    const config = getLevelConfig(startLevel);

    setIsPlaying(true);
    setIsGameOver(false);
    setWon(false);
    setScore(0);
    setMoves(0);
    setTimeLeft(config.time);
    generateNextPair(startLevel);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          endGame(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = (isWin: boolean) => {
    setIsPlaying(false);
    setIsGameOver(true);
    setWon(isWin);
    if (isWin && onLevelComplete) {
      onLevelComplete(10); // 10 coins for color clash
    }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const generateNextPair = (currentLevel = level) => {
    // Harder levels: mostly mismatch
    const matchChance = currentLevel > 30 ? 0.3 : currentLevel > 10 ? 0.4 : 0.5;
    const shouldMatch = Math.random() < matchChance;

    const wordIndex = Math.floor(Math.random() * COLORS.length);
    setCurrentWord(COLORS[wordIndex]);

    if (shouldMatch) {
      setCurrentColor(COLORS[wordIndex]);
    } else {
      let colorIndex = Math.floor(Math.random() * COLORS.length);
      while (colorIndex === wordIndex) {
        colorIndex = Math.floor(Math.random() * COLORS.length);
      }
      setCurrentColor(COLORS[colorIndex]);
    }
  };

  const handleAnswer = (userSaysMatch: boolean) => {
    if (!isPlaying) return;

    setMoves((m) => m + 1);

    const isActualMatch = currentWord.name === currentColor.name;
    const isCorrect = userSaysMatch === isActualMatch;

    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      showFeedback("correct");
      if (newScore >= getLevelConfig(level).target) {
        endGame(true);
        return;
      }
    } else {
      setScore((s) => Math.max(0, s - 1));
      showFeedback("wrong");
    }

    generateNextPair();
  };

  const showFeedback = (type: "correct" | "wrong") => {
    setFeedback(type);
    setTimeout(() => setFeedback(null), 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.key === "ArrowLeft") handleAnswer(true);
      if (e.key === "ArrowRight") handleAnswer(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, currentWord, currentColor]);

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 overflow-hidden border border-zinc-800">
      <div className="flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800">
        <button
          onClick={onBack}
          className="p-2 hover:bg-zinc-800 transition-colors flex items-center gap-2 text-zinc-400 hover:text-zinc-100 rounded-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
            Back
          </span>
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold flex items-center gap-2 text-cyan-400">
            <span>🎨</span> Color Clash
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-600 font-bold">
            Level {level}
          </span>
        </div>
        <div className="flex gap-4 items-center justify-end w-[88px] text-right font-mono text-[10px] uppercase font-bold">
          <div className="flex flex-col items-end gap-1">
            <span className="text-zinc-500 tracking-widest">
              Time: {timeLeft}s
            </span>
            <span className="text-cyan-500 tracking-widest bg-cyan-950/50 px-2 py-0.5 rounded-sm whitespace-nowrap">
              MOVES: {moves} / 100
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 lg:p-10 flex flex-col items-center justify-center relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 to-zinc-950">
        {!isPlaying && !isGameOver ? (
          <div className="w-full max-w-xl text-center bg-zinc-900 border border-zinc-800 p-8 rounded-lg shadow-xl">
            <h3 className="text-3xl font-black mb-4 tracking-tight text-zinc-100">
              LEVEL {level}
            </h3>
            <p className="font-mono text-zinc-400 text-sm mb-8 leading-relaxed max-w-md mx-auto">
              Get{" "}
              <strong className="text-cyan-400">
                {getLevelConfig(level).target}
              </strong>{" "}
              points in{" "}
              <strong className="text-cyan-400">
                {getLevelConfig(level).time}
              </strong>{" "}
              seconds!
              <br />
              <br />
              Does the <strong className="text-zinc-100">MEANING</strong> of the
              word match its{" "}
              <strong className="text-zinc-100">INK COLOR</strong>?
              <br />
              <br />
              Press <strong className="text-zinc-100">MATCH</strong> if yes.
              <br />
              Press <strong className="text-zinc-100">MISMATCH</strong> if no.
              <br />
              <br />
              <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                Keyboard: Left Arrow = Match, Right Arrow = Mismatch
              </span>
            </p>
            <button
              onClick={() => startGame(level)}
              className="px-8 py-4 bg-cyan-600 text-white font-mono text-[12px] uppercase tracking-widest hover:bg-cyan-500 transition-colors shadow-sm rounded-sm font-bold w-full max-w-xs mx-auto"
            >
              Start Level
            </button>
          </div>
        ) : isGameOver ? (
          <div className="w-full max-w-md text-center bg-zinc-900 border border-zinc-800 p-8 rounded-lg shadow-xl">
            <h3
              className={`text-4xl font-black mb-2 tracking-tight ${won ? "text-green-500" : "text-zinc-100"}`}
            >
              {won ? "LEVEL CLEARED" : "TIME'S UP!"}
            </h3>
            <div className="my-8">
              <p className="font-mono text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-2">
                Final Score
              </p>
              <p
                className={`text-6xl font-black ${won ? "text-green-400" : "text-cyan-400"}`}
              >
                {score}{" "}
                <span className="text-2xl text-zinc-600">
                  / {getLevelConfig(level).target}
                </span>
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => startGame(level)}
                className="flex-1 px-8 py-3 bg-zinc-800 border border-zinc-700 text-cyan-400 font-mono text-[10px] uppercase tracking-widest hover:bg-zinc-700 hover:text-cyan-300 mx-auto flex items-center justify-center gap-2 font-bold shadow-sm rounded-sm"
              >
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
              {won && level < 50 && (
                <button
                  onClick={() => {
                    setLevel((l) => l + 1);
                    startGame(level + 1);
                  }}
                  className="flex-1 px-8 py-3 bg-cyan-600 text-white font-mono text-[10px] uppercase tracking-widest hover:bg-cyan-700 mx-auto flex items-center justify-center gap-2 font-bold shadow-sm rounded-sm"
                >
                  Next Level
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-xl text-center flex flex-col items-center">
            <div className="absolute top-8 left-8 right-8 flex justify-between font-mono font-bold text-zinc-400 text-[12px] uppercase tracking-widest">
              <span>Score: {score}</span>
              <span
                className={timeLeft <= 10 ? "text-red-400 animate-pulse" : ""}
              >
                Time: {timeLeft}s
              </span>
            </div>

            <div className="relative h-48 w-full flex items-center justify-center mb-12">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentWord.name + currentColor.name + score}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`text-6xl md:text-8xl font-black tracking-tighter uppercase drop-shadow-sm`}
                  style={{ color: currentColor.hex }}
                >
                  {currentWord.name}
                </motion.div>
              </AnimatePresence>

              <AnimatePresence>
                {feedback === "correct" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: -20 }}
                    exit={{ opacity: 0 }}
                    className="absolute text-green-500"
                  >
                    <Check className="w-16 h-16" strokeWidth={4} />
                  </motion.div>
                )}
                {feedback === "wrong" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute text-red-500"
                  >
                    <X className="w-16 h-16" strokeWidth={4} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-4 w-full max-w-sm justify-center">
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 py-5 bg-zinc-900 border-2 border-zinc-700 hover:border-cyan-500 hover:bg-zinc-800 font-mono font-bold text-zinc-300 text-sm uppercase tracking-widest rounded-md shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-zinc-950 flex flex-col items-center gap-2"
              >
                <Check className="w-6 h-6 text-green-400" />
                Match{" "}
                <span className="text-[9px] text-zinc-500 font-normal">
                  (&larr;)
                </span>
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 py-5 bg-zinc-900 border-2 border-zinc-700 hover:border-red-500 hover:bg-zinc-800 font-mono font-bold text-zinc-300 text-sm uppercase tracking-widest rounded-md shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-950 flex flex-col items-center gap-2"
              >
                <X className="w-6 h-6 text-red-400" />
                Mismatch{" "}
                <span className="text-[9px] text-zinc-500 font-normal">
                  (&rarr;)
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
