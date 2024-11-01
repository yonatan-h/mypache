import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Compute from "./pages/compute/Compute";
import Data from "./pages/data/Data";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import NewCluster from "./pages/new-cluster/NewCluster";
import Notebook from "./pages/notebook/Notebook";

export const router = createBrowserRouter([
  {
    path: "/app",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },

      {
        path: "notebooks/:id",
        element: <Notebook />,
      },

      {
        path: "compute",
        element: <Compute />,
      },

      {
        path: "compute/new-cluster",
        element: <NewCluster />,
      },

      {
        path: "data",
        element: <Data />,
      },
    ],
  },
  {
    path: "/",
    element: <Login />,
  },
]);
