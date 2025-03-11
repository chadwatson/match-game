import * as array from "@/app/lib/array";
import { DeckRecord, GameDifficulty, GameType } from "@/app/lib/types";
import Game from "@/app/components/game";
import { neon } from "@neondatabase/serverless";

type SearchParams = {
  type?: GameType;
  deckId?: string;
  difficulty?: GameDifficulty | "" | undefined;
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

async function fetchDeck(deckId: number) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const [deck] = await sql`SELECT * FROM decks WHERE id = ${deckId}`;
  if (!deck) {
    throw new Error("Deck not found");
  }

  return {
    ...deck,
    image_urls: deck.image_urls ?? [],
  } as DeckRecord | undefined;
}

function shuffleCards(deck: DeckRecord) {
  return array.shuffle(
    array.repeat(array.shuffle(deck.image_urls ?? []).slice(0, 18))
  );
}

async function initGame(props: PageProps) {
  const { type, deckId } = await props.searchParams;

  // todo: handle non-deck games like unsplash
  if (type === "deck" && typeof deckId === "string") {
    const deck = await fetchDeck(parseInt(deckId, 10));
    if (!deck) {
      throw new Error(`Deck not found: ${deckId}`);
    }
    return [deck, shuffleCards(deck)] as [DeckRecord, string[]];
  }

  return [];
}

export default async function GamePage(props: PageProps) {
  const difficulty = "medium";
  const [deck, cards] = await initGame(props);

  const sql = neon(`${process.env.DATABASE_URL}`);
  await sql("UPDATE decks SET play_count = $1 WHERE id = $2;", [
    (deck.play_count ?? 0) + 1,
    deck.id,
  ]);

  return <Game cards={cards} difficulty={difficulty} />;
}
