export type GameDifficulty = "easy" | "medium" | "hard" | "insane";

export type GameType = "deck"; // TODO: More options to come

export type GameParams = {
  type: GameType;
  deckId?: number;
  difficulty?: GameDifficulty;
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
