import { json } from "@remix-run/node";
import { db } from "~/utils/db.server";

/**
 * This helper function helps us returning the accurate HTTP status,
 * 400 Bad Request, to the client.
 */
export async function login (username: string, password: string) {
  const usernameResult = await db.user.findUnique({
    where: {
      username: username
    },
    select: {
      passwordHash: true
    }
  })

  if (!usernameResult) {
    return null;
  }



}