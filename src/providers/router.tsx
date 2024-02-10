import { Base } from "components/base";
import { Graphs } from "pages/graphs";
import { Add } from "pages/add";
import { Login } from "pages/login";
import { Logs } from "pages/logs";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Base />,
    children: [
      {
        path: "/",
        element: <Logs />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/graphs",
        element: <Graphs />,
      },
      {
        path: "/add",
        element: <Add />,
      },
    ],
  },
]);

export const Router: React.FC = () => <RouterProvider router={router} />;
