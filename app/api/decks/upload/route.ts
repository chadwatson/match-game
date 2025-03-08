import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { userId } = await auth();

  // Protect the route by checking if the user is signed in
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  const sql = neon(`${process.env.DATABASE_URL}`);
  const [user] = await sql("SELECT id FROM users WHERE clerk_user_id = $1", [
    userId,
  ]);
  if (!user) {
    throw new Error(`Could not find user: ${userId}`);
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Generate a client token for the browser to upload the file
        // ⚠️ Authenticate and authorize users before generating the token.
        // Otherwise, you're allowing anonymous uploads.

        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/gif"],
          tokenPayload: JSON.stringify({
            userId: user.id,
            deckId: clientPayload,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        if (tokenPayload) {
          const { userId, deckId } = JSON.parse(tokenPayload) as {
            userId: number;
            deckId: string;
          };
          const [deckRecord] =
            await sql`SELECT * FROM decks WHERE id = ${parseInt(deckId, 10)};`;

          if (!deckRecord) {
            throw new Error(`Deck not found: ${deckId}`);
          }

          if (deckRecord.user_id !== userId) {
            throw new Error(`Not authorized to update deck: ${deckId}`);
          }

          const currentImageUrls = deckRecord.image_urls ?? [];
          await sql("UPDATE decks SET image_urls = $1 WHERE id = $2;", [
            [...currentImageUrls, blob.url],
            deckId,
          ]);
        }
      },
    });

    const path = request.nextUrl.searchParams.get("path");
    if (path) {
      revalidatePath(path);
      return NextResponse.json({
        ...jsonResponse,
        revalidated: true,
        now: Date.now(),
      });
    } else {
      return NextResponse.json(jsonResponse);
    }
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a
    );
  }
}
