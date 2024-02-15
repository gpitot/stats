import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "api/database";

export const Base: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
      }
    })();
  }, []);

  return (
    <article>
      <header></header>
      <main className="max-w-[500px] m-auto p-4 mb-16">
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
