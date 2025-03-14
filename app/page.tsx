import { neon } from "@neondatabase/serverless";
import { DeckRecord, UserRecord } from "./lib/types";
import GameOptionCard from "./components/game-option-card";
import { clerkClient } from "@clerk/nextjs/server";
import { ReactNode } from "react";
import { fetchUserInfo, UserInfo } from "./lib/user";
import Link from "next/link";

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

function GameList(props: {
  title: ReactNode;
  games: DeckRecord[];
  userInfo: UserInfo;
}) {
  return (
    <section className="mb-6">
      <h2 className="font-medium text-base/7 truncate mb-2">{props.title}</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {props.games.map((deck) => (
          <GameOptionCard
            key={deck.id}
            type="deck"
            deckId={deck.id}
            thumbnail={deck.image_urls?.[0]}
            title={deck.name}
            description={deck.description ?? ""}
            playCount={deck.play_count}
            owner={fetchGameOwner(deck)}
            canEdit={props.userInfo.appUser?.id === deck.user_id}
          />
        ))}
      </div>
    </section>
  );
}

async function YourDecksSection() {
  const userInfo = await fetchUserInfo();
  if (!userInfo.appUser) {
    return null;
  }

  const sql = neon(`${process.env.DATABASE_URL}`);
  const yourDecks =
    await sql`SELECT * FROM decks WHERE user_id = ${userInfo.appUser.id}`;

  return (
    <GameList
      title="Your Decks"
      games={(yourDecks as DeckRecord[]) ?? []}
      userInfo={userInfo}
    />
  );
}

export default async function Home() {
  const userInfo = await fetchUserInfo();
  const featuredGames = await fetchFeaturedGames();

  return (
    <>
      <div className="w-full py-4 px-4">
        <div className="max-w-3xl mx-auto">
          <GameList
            title={<>Featured ⭐️</>}
            games={featuredGames}
            userInfo={userInfo}
          />
          {!!userInfo.clerkUser && <YourDecksSection />}
        </div>
      </div>
      <footer className="w-full py-2 px-4">
        <div className="max-w-3xl mx-auto w-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-xs">
          <div className="mr-6">&copy; 2025 Chad Watson</div>
          <div>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
