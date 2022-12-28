import type { LinksFunction } from "@remix-run/node";
import { Outlet, Link } from "@remix-run/react";
import stylesUrl from "~/styles/jokes.css";
import type { MetaFunction } from "@remix-run/node";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const meta: MetaFunction = () => {
  return {
    title: "Something cool",
    description:
      "This becomes the nice preview on search results.",
  };
};

export default function JokesRoute() {
  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to="jokes">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              <li>
                <Link to="jokes/dcf1fe24-ea5b-4ddd-bc05-3f78f9cf428f">Hippo</Link>
              </li>
            </ul>
            <Link to="/jokes/new" className="button">
              Add your own
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      I did a whoopsies.
    </div>
  );
}