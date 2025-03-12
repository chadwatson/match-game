"use server";
import { currentUser } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { put, del } from "@vercel/blob";
import { DeckRecord, UserRecord } from "./lib/types";

async function neonWithUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Not signed in.");
  }

  const sql = neon(`${process.env.DATABASE_URL}`);
  const [user] = await sql("SELECT id FROM users WHERE clerk_user_id = $1", [
    clerkUser.id,
  ]);
  if (!user) {
    throw new Error(`Could not find user: ${clerkUser.id}`);
  }

  return { sql, user: user as UserRecord };
}

export async function getUser() {
  const { user } = await neonWithUser();
  return user;
}

export async function createDeck() {
  const { user, sql } = await neonWithUser();

  const result = await sql(
    "INSERT INTO decks(name, user_id) values('New Deck', $1) RETURNING id;",
    [user.id]
  );
  if (result[0]) {
    const deck = result[0] as DeckRecord;
    revalidatePath("/decks");
    redirect(`/decks/${deck.id}/edit`);
  }
}

export async function updateDeck(formData: FormData) {
  const { user, sql } = await neonWithUser();

  const deckId = formData.get("deck-id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  const [deckRecord] = await sql`SELECT * FROM decks WHERE id = ${deckId}`;

  if (!deckRecord) {
    throw new Error(`Deck not found: ${deckId}`);
  }

  if (deckRecord.user_id !== user.id) {
    throw new Error(`Not authorized to update custom deck: ${deckId}`);
  }

  await sql("UPDATE decks SET name = $1, description = $2 WHERE id = $3;", [
    name,
    description,
    parseInt(deckId, 10),
  ]);

  revalidatePath(`/decks/${deckRecord.id}/edit`);
}

export async function uploadDeckImages(formData: FormData) {
  const { user, sql } = await neonWithUser();

  const deckId = formData.get("deck-id") as string;

  const [deckRecord] = await sql`SELECT * FROM decks WHERE id = ${deckId};`;

  if (!deckRecord) {
    throw new Error(`Deck not found: ${deckId}`);
  }

  if (deckRecord.user_id !== user.id) {
    throw new Error(`Not authorized to update custom deck: ${deckId}`);
  }

  const files = formData.getAll("images") as File[];
  const results = await Promise.all(
    files.map((file) => put(`/decks/${file.name}`, file, { access: "public" }))
  );
  const urls = results.map(({ url }) => url);

  await sql("UPDATE decks SET image_urls = $1 WHERE id = $2;", [
    urls,
    parseInt(deckId, 10),
  ]);

  revalidatePath(`/decks/${deckRecord.id}/edit`);
}

export async function addDeckImageUrl(formData: FormData) {
  const { user, sql } = await neonWithUser();

  const deckId = formData.get("deck-id") as string;

  const [deckRecord] = await sql`SELECT * FROM decks WHERE id = ${deckId};`;

  if (!deckRecord) {
    throw new Error(`Deck not found: ${deckId}`);
  }

  if (deckRecord.user_id !== user.id) {
    throw new Error(`Not authorized to update custom deck: ${deckId}`);
  }

  const imageUrl = formData.get("image-url");
  if (imageUrl) {
    await sql("UPDATE decks SET image_urls = $1 WHERE id = $2;", [
      [...(deckRecord.image_urls ?? []), imageUrl],
      parseInt(deckId, 10),
    ]);

    revalidatePath(`/decks/${deckRecord.id}/edit`);
    revalidateTag(`/decks/${deckRecord.id}`);

    return { error: false };
  }

  return { error: true, message: "No image URL provided." };
}

export async function deleteDeckImage(formData: FormData) {
  const { user, sql } = await neonWithUser();

  const deckId = formData.get("deck-id") as string;
  const urlToDelete = formData.get("image-url") as string;

  const [deckRecord] = await sql`SELECT * FROM decks WHERE id = ${deckId};`;

  if (!deckRecord) {
    return { error: true, message: `Deck not found: ${deckId}` };
  }

  if (deckRecord.user_id !== user.id) {
    return {
      error: true,
      message: `Not authorized to update custom deck: ${deckId}`,
    };
  }

  if (!urlToDelete) {
    return { error: true, message: "No image URL provided." };
  }

  const imageUrls = new Set(deckRecord.image_urls ?? []);
  imageUrls.delete(urlToDelete);

  await sql("UPDATE decks SET image_urls = $1 WHERE id = $2;", [
    [...imageUrls],
    parseInt(deckId, 10),
  ]);

  try {
    await del(urlToDelete);
  } catch {}

  revalidatePath(`/decks/${deckRecord.id}/edit`);
  revalidateTag(`/decks/${deckRecord.id}`);

  return { error: false };
}
