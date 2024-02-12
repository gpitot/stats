import { Link, Outlet } from "react-router-dom";

export const Base: React.FC = () => {
  return (
    <article>
      <header></header>
      <main className="max-w-[500px] m-auto">
        <Outlet />
      </main>
      <footer
        className={`
        fixed bottom-0 
        left-0 w-full py-4 bg-blue-500 text-white 
        flex justify-around`}
      >
        <Link to="/">Home</Link>
        <Link to="add">Add</Link>
      </footer>
    </article>
  );
};
