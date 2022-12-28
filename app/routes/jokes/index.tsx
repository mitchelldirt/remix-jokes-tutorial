import { json } from "@remix-run/node";
import { Link, useLoaderData, useCatch } from "@remix-run/react";

import { db } from "~/utils/db.server";

export const loader = async () => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber,
  });

  if (!randomJoke) {
    throw new Response("Joke not found", {
      status: 404,
    });
  }
  return json({ randomJoke });
};

export default function Joke() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <p>Here's a random joke:</p>
      <p>{data.randomJoke.name}</p>
      <p>{data.randomJoke.content}</p>
      <Link to={data.randomJoke.id}>{data.randomJoke.name} Permalink</Link>
    </>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">
        {caught.status}: There are no jokes to display
      </div>
    );
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
