import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
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
    </article>
  );
};
