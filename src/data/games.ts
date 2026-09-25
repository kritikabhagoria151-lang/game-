import { BrainGame } from "../types";

export const gamesData: BrainGame[] = [
  {
    id: 1,
    name: "Number Guess",
    category: "Logic",
    emoji: "🔢",
    description: "Computer का number guess करो",
    controls: {
      input: "Number type karo",
      submit: "Enter",
    },
    objective: "सही number guess करो",
    hints: ["Higher", "Lower", "Very Close", "Cold"],
    game_over: "सारे chances खत्म होने पर",
    difficulty_levels: [
      { level: "Easy", range: "1-50", chances: 10 },
      { level: "Medium", range: "1-100", chances: 7 },
      { level: "Hard", range: "1-500", chances: 5 },
    ],
  },
  {
    id: 2,
    name: "Memory Game",
    category: "Memory",
    emoji: "🧠",
    description: "Cards match करो",
    controls: {
      flip: "Card पर Click करो",
      match: "Same cards दोनों flip करो",
    },
    objective: "सारे cards match करो",
    game_over: "Time खत्म होने पर",
    difficulty_levels: [
      { level: "Easy", cards: 8, time: 60 },
      { level: "Medium", cards: 16, time: 90 },
      { level: "Hard", cards: 24, time: 120 },
    ],
    scoring: {
      match_found: 20,
      time_bonus: 10,
      wrong_flip_penalty: -5,
    },
  },
  {
    id: 3,
    name: "Sliding Puzzle",
    category: "Logic",
    emoji: "🧩",
    description: "Solve the sliding number puzzle",
    controls: {
      input: "Click tile to slide",
    },
    objective: "Arrange numbers in order",
    game_over: "Puzzle Solved",
    metrics: {
      moves: "Move count",
      time: "Time taken",
    },
    difficulty_levels: [{ level: "Classic", grid: "3x3" }],
  },
  {
    id: 4,
    name: "Hangman",
    category: "Word",
    emoji: "🔡",
    description: "Hidden word guess करो",
    controls: {
      input: "Letter click या type करो",
      hint: "H key press करो",
    },
    objective: "Word guess करो hanging से पहले",
    game_over: "6 गलत guesses होने पर",
    scoring: {
      correct_letter: 10,
      word_complete: 50,
      hint_used_penalty: -10,
    },
    categories: ["Animals", "Movies", "Countries", "Food"],
    max_wrong_guesses: 6,
  },
  {
    id: 5,
    name: "Liquid Sort",
    category: "Logic",
    emoji: "🧪",
    description: "Sort colored liquids into matching tubes",
    controls: {
      select: "Click to select a tube, click another to pour",
    },
    objective: "Fill each tube with a single color",
    game_over: "All tubes sorted correctly",
    metrics: {
      moves: "Total pour attempts",
    },
  },
  {
    id: 6,
    name: "Color Clash",
    category: "Speed",
    emoji: "🎨",
    description: "Brain split: Does meaning match the ink?",
    controls: {
      input: "Left/Right arrow or On-screen buttons",
    },
    objective: "Identify matching pairs quickly",
    game_over: "Time runs out",
    metrics: {
      score: "Correct matches minus errors",
    },
    difficulty_levels: [],
  },
];
