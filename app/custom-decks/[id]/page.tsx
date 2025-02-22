import { neon } from "@neondatabase/serverless";
import CustomDeckForm from "./form";
import { CustomDeckRecord } from "@/app/lib/types";
import { currentUser } from "@clerk/nextjs/server";

type Params = {
  id: string;
};

async function fetchCustomDeck(params: Promise<Params>) {
  const { id } = await params;
  const sql = neon(`${process.env.DATABASE_URL}`);
  const [customDeck] = await sql`SELECT * FROM custom_decks WHERE id = ${id}`;
  return customDeck as CustomDeckRecord | undefined;
}

export default async function CustomDeckPage(props: {
  params: Promise<Params>;
}) {
  const user = await currentUser();
  console.log(user);
  return <CustomDeckForm customDeck={fetchCustomDeck(props.params)} />;
}
