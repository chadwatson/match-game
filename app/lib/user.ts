import { currentUser, User } from "@clerk/nextjs/server";
import { UserRecord } from "../lib/types";
import { neon } from "@neondatabase/serverless";

export type UserInfo = {
  clerkUser: User | null;
  appUser: UserRecord | null;
};

export async function fetchUserInfo(): Promise<UserInfo> {
  const defaultInfo = {
    clerkUser: null,
    appUser: null,
  } as UserInfo;

  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return defaultInfo;
    }

    const sql = neon(`${process.env.DATABASE_URL}`);
    const [user] = await sql("SELECT id FROM users WHERE clerk_user_id = $1", [
      clerkUser.id,
    ]);

    if (!user) {
      return defaultInfo;
    }

    return { clerkUser, appUser: user as UserRecord };
  } catch {
    return defaultInfo;
  }
}
