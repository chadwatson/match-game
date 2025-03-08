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
  type?: "deck" | "unsplash";
  deckId?: string;
  difficulty?: GameDifficulty | "" | undefined;
};

export type DeckRecord = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  user_id: number;
  image_urls: string[];
  featured: boolean | null;
  play_count: number | null;
};

export type UserRecord = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  updated_at: string;
  clerk_user_id: string;
};
