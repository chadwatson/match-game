import { GameParams } from "./types";

export const createPlayHref = ({
  type = "deck",
  deckId,
  difficulty = "medium",
}: GameParams) => ({
  pathname: "/play",
  query: { type, deckId, difficulty },
});

export const createPlayDeckHref = ({ deckId }: { deckId: number }) =>
  createPlayHref({ type: "deck", deckId });
