import { json } from "@remix-run/node";
import { db } from "~/utils/db.server";

var bcrypt = require('bcryptjs');

/**
 * This helper function helps us returning the accurate HTTP status,
 * 400 Bad Request, to the client.
 */
export async function login (username: string, password: string) {
  const usernameResult = await db.user.findUnique({
    where: {
      username: username
    }
  })

  if (!usernameResult) {
    return null;
  }

  if (await isCorrectPassword(password, usernameResult.passwordHash) === false) {
    return null;
  }

  return usernameResult;
}

async function isCorrectPassword(password: string, hash: string) {
const res = await bcrypt.compare(password, hash);
return res;
}