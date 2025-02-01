export type Deck = string[];

export type GameDifficulty = "easy" | "medium" | "hard" | "insane";

export type GameTheme =
  | "bluey"
  | "nature"
  | "animals"
  | "fish"
  | "mountains"
  | "cars";

export type GameParams = {
  theme: GameTheme;
  difficulty: GameDifficulty;
};

export type GamePageSearchParams = {
  theme?: GameTheme | "" | undefined;
  difficulty?: GameDifficulty | "" | undefined;
};
