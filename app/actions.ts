"use server";
import { currentUser } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createCustomDeck() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Not signed in.");
  }

  let customDeck: { id: number } | null = null;
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const [user] = await sql("SELECT id FROM users WHERE clerk_user_id = $1", [
      clerkUser.id,
    ]);
    if (user) {
      const result = await sql(
        "INSERT INTO custom_decks(name, user_id) values('New Deck', $1) RETURNING id;",
        [user.id]
      );
      if (result[0]) {
        customDeck = result[0] as { id: number };
      }
    }
  } catch (err) {
    throw new Error("Could not create custom deck.");
  }

  if (customDeck) {
    revalidatePath("/custom-decks");
    redirect(`/custom-decks/${customDeck.id}/edit`);
  }
}
