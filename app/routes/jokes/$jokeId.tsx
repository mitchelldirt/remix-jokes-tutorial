import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useParams, useCatch } from "@remix-run/react";

import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/session.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const currentUserId = await getUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response("Joke not found", {
      status: 404,
    });
  }
  return json({ joke, currentUserId });
};

export async function action({ request }: ActionArgs) {
  const form = await request.formData();
  const intent = form.get("intent");
  const jokeId = form.get("jokeId")

  if (typeof intent !== 'string' || typeof jokeId !== 'string') {
    return null;
  }

  if (intent === 'delete') {
    await db.joke.delete({
      where: {
        id: jokeId
      }
    })
  }

  return redirect('/jokes')
}

export default function JokeRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{data.joke.content}</p>
      <Link to=".">{data.joke.name} Permalink</Link>
      {data.currentUserId === data.joke.jokesterId ? (
        <>
          <form method="post">
            <input name='jokeId' type='hidden' value={data.joke.id}></input>
            <button className="button" name="intent" type="submit" value="delete">
              Delete
            </button>
          </form>
        </>
      ) : null}
    </div>
  );
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  return (
    <div className="error-container">{`There was an error loading joke by the id ${jokeId}. Sorry.`}</div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();

  if (caught.status === 404) {
    return (
      <div className="error-container">
        Joke with ID of {params.jokeId} not found
      </div>
    );
  }
  throw new Error(`Unhandled error: ${caught.status}`);
}
