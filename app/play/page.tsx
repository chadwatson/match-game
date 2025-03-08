import * as array from "@/app/lib/array";
import { GamePageSearchParams, DeckRecord } from "@/app/lib/types";
import Game from "@/app/components/game";
import { getUser } from "@/app/actions";
import { redirect } from "next/navigation";
import { neon } from "@neondatabase/serverless";

type PageParams = {
  id: string;
};

type PageProps = {
  params: Promise<PageParams>;
  searchParams: Promise<GamePageSearchParams>;
};

async function fetchDeck(deckId: number) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const [deck] = await sql`SELECT * FROM decks WHERE id = ${deckId}`;
  return {
    ...deck,
    image_urls: deck.image_urls ?? [],
  } as DeckRecord | undefined;
}

async function initGame(props: PageProps) {
  const { type, deckId } = await props.searchParams;
  let images = [] as string[];

  // todo: handle non-deck games like unsplash
  if (type === "deck" && typeof deckId === "string") {
    const deck = await fetchDeck(parseInt(deckId, 10));
    if (!deck) {
      throw new Error(`Deck not found: ${deckId}`);
    }
    images = deck.image_urls ?? [];
  }

  return array.shuffle(array.repeat(images));
}

export default async function GamePage(props: PageProps) {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const difficulty = "medium";
  const deck = initGame(props);

  return <Game deck={deck} difficulty={difficulty} />;
}
