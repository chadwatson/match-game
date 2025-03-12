import { currentUser } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { redirect } from "next/navigation";
import { DeckRecord } from "../lib/types";

export default async function NewDeckPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/");
  }

  const sql = neon(`${process.env.DATABASE_URL}`);
  const [user] = await sql("SELECT id FROM users WHERE clerk_user_id = $1", [
    clerkUser.id,
  ]);
  if (!user) {
    redirect("/");
  }

  const result = await sql(
    "INSERT INTO decks(name, user_id) values('New Deck', $1) RETURNING id;",
    [user.id]
  );
  if (result[0]) {
    const deck = result[0] as DeckRecord;
    redirect(`/decks/${deck.id}/edit`);
  }
}
