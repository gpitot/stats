import { Outlet } from "react-router-dom";

export const Base: React.FC = () => {
  return (
    <article>
      <header>
        <h1>Base</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </article>
  );
};
