import React, { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type TileInfo = {
  id: number;
  currentPos: number; // 0 to max-1
  isCorrect: boolean;
};

export default function SlidingPuzzle({
  onBack,
  onLevelComplete,
}: {
  onBack: () => void;
  onLevelComplete?: (reward?: number) => void;
}) {
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem("mindtest_slidingpuzzle_level");
    return saved ? parseInt(saved, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem("mindtest_slidingpuzzle_level", level.toString());
  }, [level]);
  const [tiles, setTiles] = useState<TileInfo[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [loading, setLoading] = useState(true);

  // Derive gridSize from level
  let gridSize = 3;
  if (level > 10 && level <= 30) gridSize = 4;
  if (level > 30) gridSize = 5;

  const tileCount = gridSize * gridSize;

  useEffect(() => {
    initPuzzle(level);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [level]);

  const isSolvable = (arr: number[], gSize: number) => {
    let inversions = 0;
    const tCount = gSize * gSize;
    const arrWithoutEmpty = arr.filter((n) => n !== tCount - 1);
    for (let i = 0; i < arrWithoutEmpty.length - 1; i++) {
      for (let j = i + 1; j < arrWithoutEmpty.length; j++) {
        if (arrWithoutEmpty[i] > arrWithoutEmpty[j]) {
          inversions++;
        }
      }
    }

    // For odd grid, inversions must be even
    if (gSize % 2 !== 0) {
      return inversions % 2 === 0;
    } else {
      // For even grid, check blank row from bottom
      const emptyIdx = arr.indexOf(tCount - 1);
      const emptyRow = Math.floor(emptyIdx / gSize);
      const emptyRowFromBottom = gSize - emptyRow;
      if (emptyRowFromBottom % 2 === 0) {
        return inversions % 2 !== 0;
      } else {
        return inversions % 2 === 0;
      }
    }
  };

  const initPuzzle = (currentLevel: number) => {
    let gSize = 3;
    if (currentLevel > 10 && currentLevel <= 30) gSize = 4;
    if (currentLevel > 30) gSize = 5;

    const tCount = gSize * gSize;

    let shuffled: number[];
    do {
      shuffled = Array.from({ length: tCount }, (_, i) => i).sort(
        () => Math.random() - 0.5,
      );
    } while (!isSolvable(shuffled, gSize) || isSolvedArray(shuffled, tCount));

    const newTiles = shuffled.map((id, pos) => ({
      id,
      currentPos: pos,
      isCorrect: id === pos,
    }));

    setTiles(newTiles);
    setMoves(0);
    setIsWon(false);
  };

  const isSolvedArray = (arr: number[], tCount: number) => {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] !== i) return false;
    }
    return arr[arr.length - 1] === tCount - 1;
  };

  const getPosCoordinates = (index: number) => {
    return {
      row: Math.floor(index / gridSize),
      col: index % gridSize,
    };
  };

  const handleTileClick = (clickedTile: TileInfo) => {
    if (isWon || clickedTile.id === tileCount - 1) return;

    const emptyTile = tiles.find((t) => t.id === tileCount - 1)!;

    const clickedCoords = getPosCoordinates(clickedTile.currentPos);
    const emptyCoords = getPosCoordinates(emptyTile.currentPos);

    const isAdjacent =
      (Math.abs(clickedCoords.row - emptyCoords.row) === 1 &&
        clickedCoords.col === emptyCoords.col) ||
      (Math.abs(clickedCoords.col - emptyCoords.col) === 1 &&
        clickedCoords.row === emptyCoords.row);

    if (isAdjacent) {
      const newTiles = tiles.map((tile) => {
        if (tile.id === clickedTile.id) {
          return {
            ...tile,
            currentPos: emptyTile.currentPos,
            isCorrect: tile.id === emptyTile.currentPos,
          };
        }
        if (tile.id === emptyTile.id) {
          return {
            ...tile,
            currentPos: clickedTile.currentPos,
            isCorrect: tile.id === clickedTile.currentPos,
          };
        }
        return tile;
      });

      setTiles(newTiles);
      setMoves((m) => m + 1);

      // Check win condition
      const checkWin = newTiles.every((t) => t.id === t.currentPos);
      if (checkWin) {
        setIsWon(true);
        if (onLevelComplete) onLevelComplete(40); // 40 coins for puzzle
      }
    }
  };

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
              SLIDE_PUZZLE
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-600 font-bold">
              Level {level}
            </span>
          </div>
        </div>
        <div className="w-[88px] text-right flex flex-col items-end gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-700 bg-cyan-50 px-2 py-1 border border-cyan-200 rounded-sm font-bold">
            MOVES: {moves} / {50 + level * 20}
          </span>
        </div>
      </div>

      <div className="flex-1 p-8 flex flex-col items-center justify-center relative">
        {loading ? (
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
        ) : (
          <div className="w-full max-w-sm flex flex-col items-center">
            <AnimatePresence>
              {isWon && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-10 left-0 right-0 z-20 flex flex-col items-center"
                >
                  <div className="text-center bg-white border border-gray-200 p-8 rounded-md shadow-xl flex flex-col items-center">
                    <h3 className="text-3xl font-black text-green-600 mb-2">
                      PUZZLE SOLVED!
                    </h3>
                    <p className="font-mono text-gray-500 text-[11px] uppercase tracking-widest mb-6 font-bold">
                      Completed in {moves} moves
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => initPuzzle(level)}
                        className="px-6 py-3 bg-cyan-50 border border-cyan-200 text-cyan-700 font-mono text-[10px] uppercase tracking-widest hover:bg-cyan-100 flex items-center gap-2 font-bold shadow-sm rounded-sm"
                      >
                        <RefreshCw className="w-4 h-4" /> Retry
                      </button>
                      {level < 50 && (
                        <button
                          onClick={() => setLevel((l) => l + 1)}
                          className="px-6 py-3 bg-cyan-600 border border-cyan-700 text-white font-mono text-[10px] uppercase tracking-widest hover:bg-cyan-700 flex items-center justify-center font-bold shadow-sm rounded-sm"
                        >
                          Next Level
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mb-8 p-1 bg-white border border-gray-200 shadow-md rounded-md">
              <div className="relative w-[300px] h-[300px] bg-gray-100 overflow-hidden">
                {/* Render Tiles */}
                {tiles.map((tile) => {
                  const { row, col } = getPosCoordinates(tile.currentPos);
                  const isEmpty = tile.id === tileCount - 1;

                  if (isEmpty && !isWon) return null;

                  const tileSize = 300 / gridSize;

                  return (
                    <motion.div
                      key={tile.id}
                      initial={false}
                      animate={{
                        x: col * tileSize,
                        y: row * tileSize,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      onClick={() => handleTileClick(tile)}
                      style={{
                        width: tileSize - 4,
                        height: tileSize - 4,
                        margin: 2,
                      }}
                      className={`absolute flex items-center justify-center rounded-md font-mono ${gridSize > 3 ? "text-2xl" : "text-4xl"} font-black
                               ${isEmpty ? "bg-transparent text-transparent" : "cursor-pointer bg-white border-2 border-cyan-200 text-cyan-700 shadow-sm hover:bg-cyan-50 hover:border-cyan-400"}
                               ${isWon && !isEmpty ? "bg-green-50 border-green-300 text-green-700" : ""}
                            `}
                    >
                      {!isEmpty && tile.id + 1}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => initPuzzle(level)}
                className="px-6 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 rounded-sm shadow-sm font-bold"
              >
                <RefreshCw className="w-3 h-3" /> Shuffle
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
