import { neon } from "@neondatabase/serverless";
import CustomDeckForm from "./form";
import { DeckRecord } from "@/app/lib/types";
import { redirect } from "next/navigation";
import { getUser } from "@/app/actions";

type Params = {
  id: string;
};

async function fetchCustomDeck(params: Promise<Params>) {
  const { id } = await params;
  const sql = neon(`${process.env.DATABASE_URL}`);
  const [deck] = await sql`SELECT * FROM decks WHERE id = ${id}`;
  return {
    ...deck,
    image_urls: deck.image_urls ?? [],
  } as DeckRecord | undefined;
}

export default async function CustomDeckPage(props: {
  params: Promise<Params>;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  return <CustomDeckForm deck={fetchCustomDeck(props.params)} user={user} />;
}
