import { Base } from "components/base";
import { Graphs } from "pages/graphs";
import { Add } from "pages/add";
import { Login } from "pages/login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Base />,
    children: [
      {
        path: "/",
        element: <Graphs />,
      },
      {
        path: "/add",
        element: <Add />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

export const Router: React.FC = () => <RouterProvider router={router} />;
