import React, { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw, Lightbulb, FastForward } from "lucide-react";

const LEVEL_DATA = [
  { level: 1, word: "CAT", category: "Animals", hint: "Meows and purrs" },
  { level: 2, word: "APPLE", category: "Food", hint: "A red or green fruit" },
  {
    level: 3,
    word: "WATER",
    category: "Nature",
    hint: "Clear liquid we drink",
  },
  {
    level: 4,
    word: "TIGER",
    category: "Animals",
    hint: "Large cat with stripes",
  },
  {
    level: 5,
    word: "PIZZA",
    category: "Food",
    hint: "Has cheese and tomato sauce",
  },
  {
    level: 6,
    word: "GUITAR",
    category: "Music",
    hint: "Instrument with strings",
  },
  {
    level: 7,
    word: "BRAZIL",
    category: "Countries",
    hint: "Famous for the Amazon",
  },
  {
    level: 8,
    word: "JUPITER",
    category: "Space",
    hint: "Largest planet in our solar system",
  },
  {
    level: 9,
    word: "DOCTOR",
    category: "Professions",
    hint: "Treats sick people",
  },
  {
    level: 10,
    word: "PYRAMID",
    category: "Monuments",
    hint: "Ancient Egyptian structures",
  },
  {
    level: 11,
    word: "ELEPHANT",
    category: "Animals",
    hint: "Has a long trunk",
  },
  {
    level: 12,
    word: "INCEPTION",
    category: "Movies",
    hint: "A dream within a dream",
  },
  {
    level: 13,
    word: "SYMPHONY",
    category: "Music",
    hint: "An elaborate musical composition",
  },
  {
    level: 14,
    word: "ASTRONAUT",
    category: "Professions",
    hint: "Travels to space",
  },
  {
    level: 15,
    word: "KALEIDOSCOPE",
    category: "Things",
    hint: "Tube of reflecting mirrors and colors",
  },
  { level: 16, word: "OXYGEN", category: "Science", hint: "Gas we breathe" },
  { level: 17, word: "ZOMBIE", category: "Fantasy", hint: "Undead creature" },
  {
    level: 18,
    word: "GALAXY",
    category: "Space",
    hint: "Vast system of stars",
  },
  { level: 19, word: "VOLCANO", category: "Nature", hint: "Erupts with lava" },
  {
    level: 20,
    word: "CHAMPION",
    category: "Sports",
    hint: "The ultimate winner",
  },
  {
    level: 21,
    word: "JAZZ",
    category: "Music",
    hint: "Genre known for improvisation",
  },
  {
    level: 22,
    word: "BICYCLE",
    category: "Transport",
    hint: "Two-wheeled vehicle",
  },
  {
    level: 23,
    word: "NINJA",
    category: "History",
    hint: "Stealthy Japanese warrior",
  },
  {
    level: 24,
    word: "QUARANTINE",
    category: "Medical",
    hint: "Period of isolation",
  },
  {
    level: 25,
    word: "VAMPIRE",
    category: "Fantasy",
    hint: "Drinks blood, hates garlic",
  },
  {
    level: 26,
    word: "MYSTERY",
    category: "Genres",
    hint: "A puzzle or unknown secret",
  },
  {
    level: 27,
    word: "XYLOPHONE",
    category: "Music",
    hint: "Instrument with wooden bars",
  },
  {
    level: 28,
    word: "PARACHUTE",
    category: "Adventure",
    hint: "Used for safe skydiving",
  },
  {
    level: 29,
    word: "AVALANCHE",
    category: "Nature",
    hint: "Mass of snow falling rapidly",
  },
  {
    level: 30,
    word: "PANDEMONIUM",
    category: "Concepts",
    hint: "Wild and noisy disorder",
  },
  {
    level: 31,
    word: "CRYPTOGRAPHY",
    category: "Science",
    hint: "The art of writing or solving codes",
  },
  {
    level: 32,
    word: "QUINTESSENTIAL",
    category: "Words",
    hint: "Representing the most perfect example",
  },
  {
    level: 33,
    word: "MACHIAVELLIAN",
    category: "Concepts",
    hint: "Cunning, scheming, and unscrupulous",
  },
  {
    level: 34,
    word: "SCHIZOPHRENIA",
    category: "Medical",
    hint: "A long-term mental disorder",
  },
  {
    level: 35,
    word: "EUPHORIA",
    category: "Emotions",
    hint: "A feeling of intense excitement",
  },
  {
    level: 36,
    word: "HYPOTHESIS",
    category: "Science",
    hint: "A proposed explanation",
  },
  {
    level: 37,
    word: "PARADIGM",
    category: "Concepts",
    hint: "A typical example or pattern",
  },
  {
    level: 38,
    word: "OMNIPRESENT",
    category: "Words",
    hint: "Widely or constantly encountered",
  },
  {
    level: 39,
    word: "SERENDIPITY",
    category: "Concepts",
    hint: "Happy coincidence",
  },
  {
    level: 40,
    word: "MELANCHOLY",
    category: "Emotions",
    hint: "A feeling of pensive sadness",
  },
  {
    level: 41,
    word: "UBIQUITOUS",
    category: "Words",
    hint: "Present, appearing, or found everywhere",
  },
  {
    level: 42,
    word: "ENIGMA",
    category: "Words",
    hint: "A person or thing that is mysterious",
  },
  {
    level: 43,
    word: "CACOPHONY",
    category: "Concepts",
    hint: "A harsh discordant mixture of sounds",
  },
  {
    level: 44,
    word: "EPHEMERAL",
    category: "Words",
    hint: "Lasting for a very short time",
  },
  {
    level: 45,
    word: "MEGALOMANIAC",
    category: "Words",
    hint: "A person obsessed with their own power",
  },
  {
    level: 46,
    word: "PHILOSOPHY",
    category: "Academics",
    hint: "The study of fundamental nature of knowledge",
  },
  {
    level: 47,
    word: "RENAISSANCE",
    category: "History",
    hint: "A revival of or renewed interest in something",
  },
  {
    level: 48,
    word: "PSYCHOLOGY",
    category: "Academics",
    hint: "The scientific study of the human mind",
  },
  {
    level: 49,
    word: "ARCHAEOLOGY",
    category: "Science",
    hint: "Study of human history through excavation",
  },
  {
    level: 50,
    word: "ASTROPHYSICS",
    category: "Science",
    hint: "Branch of astronomy concerning physical nature of stars",
  },
];

export default function Hangman({
  onBack,
  onLevelComplete,
}: {
  onBack: () => void;
  onLevelComplete?: (reward?: number) => void;
}) {
  const [currentLevel, setCurrentLevel] = useState(() => {
    const saved = localStorage.getItem("mindtest_hangman_level");
    return saved ? parseInt(saved, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem("mindtest_hangman_level", currentLevel.toString());
  }, [currentLevel]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);

  // Get current level info
  const currentInfo =
    LEVEL_DATA[Math.min(currentLevel - 1, LEVEL_DATA.length - 1)];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "h") {
        setShowHint(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const resetLevel = () => {
    setGuesses([]);
    setShowHint(false);
  };

  const nextLevel = () => {
    setCurrentLevel((prev) => Math.min(50, prev + 1));
    resetLevel();
  };

  const restartGame = () => {
    setCurrentLevel(1);
    resetLevel();
  };

  const retryLevel = () => {
    resetLevel();
  };

  const handleGuess = (letter: string) => {
    if (!guesses.includes(letter)) {
      setGuesses([...guesses, letter]);
    }
  };

  const wrongGuesses = guesses.filter(
    (g) => !currentInfo.word.includes(g),
  ).length;
  const isLose = wrongGuesses >= 6;
  const isWin =
    currentInfo.word &&
    currentInfo.word.split("").every((l) => guesses.includes(l));

  useEffect(() => {
    if (isWin && onLevelComplete) {
      onLevelComplete(15); // 15 coins for word puzzle
    }
  }, [isWin]);

  const isGameComplete = isWin && currentLevel >= 50;

  return (
    <div className="flex flex-col h-full bg-gray-50 text-gray-900 overflow-hidden border border-gray-200">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 transition-colors flex items-center gap-2 text-gray-400 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 hover:text-gray-700 font-bold">
            Back
          </span>
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold flex items-center gap-2 text-cyan-600">
            <span>🔡</span> Hangman
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-700 font-bold">
            Level {currentLevel} / {LEVEL_DATA.length}
          </span>
        </div>
        <div className="flex gap-4 items-center justify-end w-[88px] text-right">
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              {6 - wrongGuesses} Tries
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-600 bg-cyan-50/50 px-2 py-1 rounded-sm font-bold whitespace-nowrap">
              MOVES: {guesses.length} / 26
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 flex flex-col items-center justify-center relative">
        {isWin || isLose ? (
          <div className="text-center">
            <h3
              className={`text-4xl font-black mb-2 tracking-tight ${isWin ? "text-cyan-600" : "text-red-600"}`}
            >
              {isGameComplete
                ? "YOU BEAT THE GAME!"
                : isWin
                  ? "LEVEL CLEARED"
                  : "GAME OVER"}
            </h3>
            <p className="font-mono text-gray-500 text-[10px] uppercase tracking-widest mb-6 font-bold">
              Word:{" "}
              <span className="text-gray-900 text-base">
                {currentInfo.word}
              </span>
            </p>
            {isWin && !isGameComplete ? (
              <button
                onClick={nextLevel}
                className="px-8 py-3 bg-cyan-50 border border-cyan-200 text-cyan-700 font-mono text-[10px] uppercase tracking-widest hover:bg-cyan-100 mx-auto flex items-center gap-2 font-bold shadow-sm"
              >
                Next Level <FastForward className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={
                  isGameComplete ? restartGame : isWin ? nextLevel : retryLevel
                }
                className="px-8 py-3 bg-cyan-50 border border-cyan-200 text-cyan-700 font-mono text-[10px] uppercase tracking-widest hover:bg-cyan-100 mx-auto flex items-center gap-2 font-bold shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />{" "}
                {isGameComplete ? "Play Again" : "Retry Level"}
              </button>
            )}
          </div>
        ) : (
          <div className="w-full max-w-xl text-center">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-white border border-gray-200 font-mono text-[10px] uppercase tracking-widest text-gray-600 font-bold shadow-sm">
                Category: {currentInfo.category}
              </span>
            </div>

            {showHint ? (
              <div className="mb-6 flex items-center justify-center gap-2 text-cyan-700 font-mono text-sm tracking-widest border border-cyan-200 bg-cyan-50 py-2 px-4 rounded-md font-bold shadow-sm">
                <Lightbulb className="w-4 h-4" /> {currentInfo.hint}
              </div>
            ) : (
              <button
                onClick={() => setShowHint(true)}
                className="mb-6 flex items-center justify-center gap-2 text-gray-500 hover:text-cyan-600 transition-colors font-mono text-[10px] uppercase tracking-widest mx-auto font-bold"
              >
                <Lightbulb className="w-4 h-4" /> Press 'H' or Click for Hint
              </button>
            )}

            <div className="mb-12 font-mono text-5xl tracking-[0.4em] text-gray-900 font-black bg-white border border-gray-200 py-10 rounded-lg shadow-sm flex justify-center flex-wrap gap-y-4">
              {currentInfo.word.split("").map((l, i) => (
                <span
                  key={i}
                  className="inline-block w-12 text-center border-b-4 border-gray-300 mx-1 pb-2"
                >
                  {guesses.includes(l) ? l : "\u00A0"}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-3 max-w-lg mx-auto">
              {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => (
                <button
                  key={l}
                  disabled={guesses.includes(l)}
                  onClick={() => handleGuess(l)}
                  className="w-12 h-12 border border-gray-300 bg-white text-gray-500 font-mono hover:border-cyan-400 hover:text-cyan-600 hover:bg-cyan-50 disabled:opacity-30 disabled:border-gray-200 disabled:hover:bg-white transition-colors text-lg shadow-sm rounded-sm font-bold"
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
