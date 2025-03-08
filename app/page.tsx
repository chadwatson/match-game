import { neon } from "@neondatabase/serverless";
import { DeckRecord, UserRecord } from "./lib/types";
import GameOptionCard from "./components/game-option-card";
import { clerkClient } from "@clerk/nextjs/server";

async function fetchFeaturedGames() {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const featuredDecks = await sql`SELECT * FROM decks WHERE featured = TRUE`;
  return featuredDecks as DeckRecord[];
}

async function fetchGameOwner(deck: DeckRecord) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const results =
    await sql`SELECT clerk_user_id FROM users WHERE id = ${deck.user_id}`;

  if (!results[0]) {
    return null;
  }

  const user = results[0] as UserRecord;
  const client = await clerkClient();
  return await client.users.getUser(user.clerk_user_id);
}

export default async function Home() {
  const featuredGames = await fetchFeaturedGames();
  return (
    <div className="w-full py-4 px-4">
      <div className="max-w-3xl">
        <h2 className="font-medium text-base/7 truncate mb-4">Featured ⭐️</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {featuredGames.map((deck) => (
            <GameOptionCard
              key={deck.id}
              type="deck"
              deckId={deck.id}
              thumbnail={deck.image_urls?.[0]}
              title={deck.name}
              description={deck.description ?? ""}
              playCount={deck.play_count}
              owner={fetchGameOwner(deck)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
