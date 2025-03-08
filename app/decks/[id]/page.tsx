import * as array from "@/app/lib/array";
import { GameParams, GamePageSearchParams, DeckRecord } from "@/app/lib/types";
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

async function fetchDeck(params: PageProps["params"]) {
  const { id } = await params;
  const sql = neon(`${process.env.DATABASE_URL}`);
  const [deck] = await sql`SELECT * FROM decks WHERE id = ${id}`;
  return {
    ...deck,
    image_urls: deck.image_urls ?? [],
  } as DeckRecord | undefined;
}

async function initGame(props: PageProps) {
  const [searchParams, params] = await Promise.all([
    props.searchParams,
    props.params,
  ]);

  const gameParams = {
    difficulty: searchParams.difficulty || "medium",
    theme: searchParams.theme || "nature",
  } as GameParams;
  const deck = await fetchDeck(props.params);

  if (!deck) {
    throw new Error(`Deck not found: ${params.id}`);
  }

  return array.shuffle(array.repeat(deck.image_urls));
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
