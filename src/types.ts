export interface GameControl {
  input?: string;
  submit?: string;
  select?: string;
  timer?: string;
  flip?: string;
  match?: string;
  hint?: string;
  confirm?: string;
}

export interface DifficultyLevelObj {
  level: string;
  range?: string;
  chances?: number;
  cards?: number;
  time?: number;
  words?: string;
  grid?: string;
}

export interface GameScoring {
  correct_answer?: number;
  time_bonus?: number;
  streak_bonus?: number;
  wrong_answer?: number;
  match_found?: number;
  wrong_flip_penalty?: number;
  correct_letter?: number;
  word_complete?: number;
  hint_used_penalty?: number;
  correct_first_try?: number;
  correct_with_hint?: number;
  wrong_answer_penalty?: number;
  correct_pattern?: number;
  per_step_bonus?: number;
  streak_3?: number;
  streak_5?: number;
}

export interface BrainGame {
  id: number;
  name: string;
  category?: "Logic" | "Memory" | "Speed" | "Word" | "Trivia";
  emoji: string;
  description: string;
  controls: GameControl;
  objective: string;
  hints?: string[];
  game_over: string;
  difficulty_levels?: string[] | DifficultyLevelObj[];
  scoring?: GameScoring;
  categories?: string[];
  metrics?: Record<string, string>;
  max_wrong_guesses?: number;
  colors?: string[];
  levels?: string;
  leaderboard?: boolean;
}
