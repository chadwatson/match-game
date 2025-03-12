import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  if (evt.type === "user.created") {
    const { id, first_name, last_name, email_addresses } = evt.data;
    const sql = neon(`${process.env.DATABASE_URL}`);

    await sql`INSERT INTO users(first_name, last_name, clerk_user_id, email_address) VALUES (${
      first_name ?? ""
    }, ${last_name ?? ""}, ${id}, ${email_addresses[0]?.email_address ?? ""});`;
  } else if (evt.type === "user.updated") {
    const { id, first_name, last_name, email_addresses } = evt.data;
    const sql = neon(`${process.env.DATABASE_URL}`);

    await sql`UPDATE users
      SET first_name = ${first_name ?? ""},
          last_name = ${last_name ?? ""},
          email_address = ${email_addresses[0]?.email_address ?? ""}
      WHERE clerk_user_id = ${id};`;
  } else if (evt.type === "user.deleted") {
    const { id } = evt.data;
    const sql = neon(`${process.env.DATABASE_URL}`);

    await sql`DELETE FROM users WHERE clerk_user_id = ${id};`;
  }

  return new Response("Webhook received", { status: 200 });
}
