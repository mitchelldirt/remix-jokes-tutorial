import { db } from "~/utils/db.server";
import { createCookieSessionStorage, redirect } from "@remix-run/node";

import bcrypt from 'bcryptjs'

/**
 * This helper function helps us returning the accurate HTTP status,
 * 400 Bad Request, to the client.
 */
export async function login(username: string, password: string) {
  const user = await db.user.findUnique({
    where: {
      username: username
    }
  })

  if (!user) {
    return null;
  }

  if (await isCorrectPassword(password, user.passwordHash) === false) {
    return null;
  }
  console.log({ id: user.id, username });
  return { id: user.id, username };
}

export async function register(username: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {username, passwordHash}
  })

  return {id: user.id, username}
}

async function isCorrectPassword(password: string, hash: string) {
  const res = await bcrypt.compare(password, hash);
  return res;
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

export const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    }
  })
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  console.log(userId)
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([
      ["redirectTo", redirectTo],
    ]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  try {
    const user = db.user.findUnique({
      where: {
        id: userId
      },
      select: { id: true, username: true }
    });
    return user;
  } catch {
    throw logout(request);
  }

}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect('/login', {
    headers: {
      "Set-Cookie": await storage.destroySession(session)
    }
  })
}
