import { Link, Outlet } from "react-router-dom";

export const Base: React.FC = () => {
  return (
    <article>
      <header></header>
      <main>
        <Outlet />
      </main>
      <footer
        className={`
        fixed bottom-0 
        left-0 w-full py-4 bg-blue-500 text-white 
        flex justify-around`}
      >
        <Link to="/">Logs</Link>
        <Link to="add">Add</Link>
        <Link to="graphs">Graphs</Link>
      </footer>
    </article>
  );
};
