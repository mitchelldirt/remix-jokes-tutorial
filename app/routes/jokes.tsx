import { LiveReload ,Outlet } from "@remix-run/react";

export default function JokesRoute() {
  return (
    <div>
      <h1>J🤪KES</h1>
      <main>
        <Outlet />
        <LiveReload />
      </main>
    </div>
  );
}
