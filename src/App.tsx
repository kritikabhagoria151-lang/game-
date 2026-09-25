/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Volume2, VolumeX, Brain, Coins } from "lucide-react";
import { gamesData } from "./data/games";
import NumberGuess from "./components/NumberGuess";
import MemoryGame from "./components/MemoryGame";
import SlidingPuzzle from "./components/SlidingPuzzle";
import Hangman from "./components/Hangman";
import LiquidSort from "./components/LiquidSort";
import ColorClash from "./components/ColorClash";

export default function App() {
  const [activeGame, setActiveGame] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [isBooted, setIsBooted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem("mindtest_coins");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [rewardNotification, setRewardNotification] = useState<{
    id: number;
    amount: number;
  } | null>(null);

  const categories = ["All", "Logic", "Memory", "Speed", "Word"];

  useEffect(() => {
    localStorage.setItem("mindtest_coins", coins.toString());
  }, [coins]);

  const handleLevelComplete = (reward: number = 10) => {
    setCoins((prev) => prev + reward);
    setRewardNotification({ id: Date.now(), amount: reward });
    setTimeout(() => {
      setRewardNotification(null);
    }, 4000); // 4 seconds animation
  };

  const filteredGames =
    activeCategory === "All"
      ? gamesData
      : gamesData.filter((game) => game.category === activeCategory);

  useEffect(() => {
    if (!isBooted) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(
        "/sigmamusicart-happy-happy-kids-music-537737.mp3",
      );
      audioRef.current.loop = true;
      audioRef.current.volume = 0.2;
    }

    if (isMusicEnabled) {
      audioRef.current.play().catch(() => {
        setIsMusicEnabled(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isMusicEnabled, isBooted]);

  const toggleMusic = () => {
    setIsMusicEnabled(!isMusicEnabled);
  };

  const renderGame = () => {
    switch (activeGame) {
      case 1:
        return (
          <NumberGuess
            onBack={() => setActiveGame(null)}
            onLevelComplete={handleLevelComplete}
          />
        );
      case 2:
        return (
          <MemoryGame
            onBack={() => setActiveGame(null)}
            onLevelComplete={handleLevelComplete}
          />
        );
      case 3:
        return (
          <SlidingPuzzle
            onBack={() => setActiveGame(null)}
            onLevelComplete={handleLevelComplete}
          />
        );
      case 4:
        return (
          <Hangman
            onBack={() => setActiveGame(null)}
            onLevelComplete={handleLevelComplete}
          />
        );
      case 5:
        return (
          <LiquidSort
            onBack={() => setActiveGame(null)}
            onLevelComplete={handleLevelComplete}
          />
        );
      case 6:
        return (
          <ColorClash
            onBack={() => setActiveGame(null)}
            onLevelComplete={handleLevelComplete}
          />
        );
      default:
        return null;
    }
  };

  if (!isBooted) {
    return (
      <div
        className="min-h-screen bg-slate-50 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden"
        onClick={() => setIsBooted(true)}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)] pointer-events-none"></div>

        {/* Giant Floating Cartoon Mind (Boot Screen) */}
        <motion.div
          animate={{
            rotate: [0, -5, 5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none text-blue-900 flex items-center justify-center"
        >
          <Brain
            strokeWidth={1}
            className="w-[120vw] h-[120vw] max-w-[1200px] max-h-[1200px]"
          />
        </motion.div>

        {/* Animated subtle shapes for boot screen */}
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] left-[20%] w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] right-[20%] w-80 h-80 bg-blue-200/20 rounded-full blur-3xl pointer-events-none"
        />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center z-10"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0px 0px 20px rgba(6,182,212,0.1)",
                "0px 0px 60px rgba(6,182,212,0.3)",
                "0px 0px 20px rgba(6,182,212,0.1)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="p-8 rounded-full bg-white/80 backdrop-blur-xl border border-white/50 mb-8 shadow-xl"
          >
            <Brain className="w-32 h-32 text-cyan-600 filter drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]" />
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 uppercase mb-4 filter drop-shadow-sm">
            MIND TEST
          </h1>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-mono text-cyan-700/80 uppercase tracking-[0.5em] text-sm mt-8 border border-cyan-200 bg-cyan-50 px-6 py-2 rounded-sm font-semibold"
          >
            Click to Initialize
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 font-mono text-gray-400 text-[10px] uppercase tracking-[0.3em]"
          >
            System Architect:{" "}
            <span className="text-cyan-700/80 font-bold">Kritika</span>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative text-gray-900 font-sans flex flex-col items-center selection:bg-cyan-100 selection:text-cyan-900 underline-offset-4 overflow-x-hidden">
      {/* Animated beautiful background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-slate-50"></div>
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-cyan-200/40 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] bg-blue-200/30 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [-50, 50, -50],
            y: [50, -50, 50],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] bg-purple-200/20 rounded-full blur-[80px]"
        />

        {/* Giant Floating Cartoon Mind */}
        <motion.div
          animate={{
            rotate: [0, 4, -4, 0],
            y: [-30, 30, -30],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none text-blue-900 flex items-center justify-center"
        >
          <Brain
            strokeWidth={1.5}
            className="w-[100vw] h-[100vw] max-w-[800px] max-h-[800px] drop-shadow-2xl"
          />
        </motion.div>

        {/* Subtle grid overlay overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
      </div>

      {/* Top Navigation Header */}
      <header className="w-full flex items-center justify-between py-5 px-6 md:px-10 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-cyan-50 border border-cyan-200 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <Brain className="w-7 h-7 text-cyan-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-gray-900 leading-none uppercase">
              MIND TEST
            </h1>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-600/80 mt-2 font-bold">
              v.4.0.2 / System.Ready
            </p>
          </div>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] font-mono uppercase tracking-widest text-gray-400">
          <div className="flex flex-col items-end justify-center">
            <span className="text-gray-500 mb-1">Coins</span>
            <span className="text-yellow-600 flex items-center gap-1.5 font-bold">
              <Coins className="w-3.5 h-3.5" />
              {coins}
            </span>
          </div>
          <div className="flex flex-col items-end justify-center">
            <span className="text-gray-500 mb-1">Status</span>
            <span className="text-green-600 flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>{" "}
              Online
            </span>
          </div>
          <div
            className="flex flex-col items-end justify-center cursor-pointer hover:text-cyan-600 transition-colors"
            onClick={toggleMusic}
          >
            <span className="text-gray-500 mb-1">Audio</span>
            <span className="flex items-center gap-1.5 font-bold text-gray-700">
              {isMusicEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-cyan-600" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
              {isMusicEnabled ? "Active" : "Muted"}
            </span>
          </div>
          <div className="flex flex-col items-end justify-center">
            <span className="text-gray-500 mb-1">Modules</span>
            <span className="text-cyan-700 px-2 py-0.5 bg-cyan-50 border border-cyan-200 rounded-sm font-bold">
              {gamesData.length} Valid
            </span>
          </div>
        </div>
      </header>

      <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col pt-8 md:pt-12 p-4 md:p-10 mb-10">
        {/* Dynamic Content Area */}
        <div className="flex-1 w-full relative min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeGame === null ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-4">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight text-gray-900 mb-2">
                      ARCADE MODULES
                    </h2>
                    <p className="text-gray-500 font-mono text-[11px] uppercase tracking-widest font-bold">
                      Select a cognitive challenge to begin
                    </p>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[10px] text-gray-500 tracking-widest uppercase font-bold">
                    <span className="flex items-center gap-1.5">
                      <div className="w-3 h-3 border border-gray-300 bg-white shadow-sm"></div>{" "}
                      Unplayed
                    </span>
                    <span className="flex items-center gap-1.5">
                      <div className="w-3 h-3 border border-cyan-300 bg-cyan-50 shadow-sm"></div>{" "}
                      Active
                    </span>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors rounded-sm font-bold border backdrop-blur-sm ${
                        activeCategory === cat
                          ? "bg-cyan-50/80 border-cyan-300 text-cyan-700 shadow-sm"
                          : "bg-white/60 border-gray-200 text-gray-500 hover:border-cyan-200 hover:text-cyan-600 hover:bg-white/80 shadow-sm"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {filteredGames.map((game, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={game.id}
                      onClick={() => setActiveGame(game.id)}
                      className="relative bg-white/60 backdrop-blur-md border border-gray-200/60 p-6 flex flex-col justify-between hover:border-cyan-400 hover:bg-white/90 transition-all cursor-pointer group shadow-sm hover:shadow-[0_4px_20px_rgba(6,182,212,0.1)] overflow-hidden rounded-xl"
                    >
                      {/* Decorative corner accent */}
                      <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-gray-100 to-transparent group-hover:from-cyan-100/50 transition-colors"></div>

                      <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="text-4xl group-hover:scale-110 group-hover:rotate-3 transition-transform origin-bottom-left filter drop-shadow-sm">
                          {game.emoji}
                        </div>
                        <div className="font-mono text-[9px] uppercase tracking-widest bg-gray-100 px-2 py-1 text-gray-600 border border-gray-200 group-hover:border-cyan-300 group-hover:text-cyan-700 group-hover:bg-cyan-50 transition-colors font-bold">
                          MOD // {String(game.id).padStart(2, "0")}
                        </div>
                      </div>

                      <div className="relative z-10 w-full mb-6 flex-1">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-600 transition-colors tracking-tight text-gray-900">
                          {game.name}
                        </h3>
                        <div className="w-8 h-[1px] bg-gray-300 mb-3 group-hover:bg-cyan-400 group-hover:w-16 transition-all duration-300"></div>
                        <p className="text-[13px] text-gray-500 leading-relaxed">
                          {game.description}
                        </p>
                      </div>

                      <div className="mt-auto flex items-center justify-between relative z-10 border-t border-gray-100 pt-4 w-full">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400 group-hover:text-gray-500 transition-colors font-bold">
                          Ready
                        </span>
                        <kbd className="text-[10px] uppercase border border-gray-200 bg-gray-50 px-2 py-1 rounded-sm text-gray-500 font-mono flex items-center gap-1 group-hover:border-cyan-200 group-hover:text-cyan-600 group-hover:bg-white transition-colors shadow-sm font-bold">
                          {game.controls.submit ||
                            game.controls.timer ||
                            "Click"}
                          <ArrowLeft className="w-3 h-3 rotate-180 opacity-50 block" />
                        </kbd>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="game-view"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                className="absolute inset-0 w-full h-full max-w-4xl mx-auto"
              >
                <div className="h-[600px] rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5 bg-white/80 backdrop-blur-2xl relative z-10">
                  {renderGame()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Reward Notification Overlay */}
        <AnimatePresence>
          {rewardNotification && (
            <motion.div
              key={rewardNotification.id}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
              }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-yellow-400 text-yellow-950 px-6 py-4 rounded-full shadow-[0_10px_40px_rgba(250,204,21,0.4)] border border-yellow-300 font-bold tracking-wide"
            >
              <div
                className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center animate-spin"
                style={{ animationDuration: "3s" }}
              >
                <Coins className="w-5 h-5 text-yellow-900" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest opacity-80 leading-none mb-1">
                  Level Complete!
                </span>
                <span className="text-xl leading-none">
                  +{rewardNotification.amount} Coins
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
