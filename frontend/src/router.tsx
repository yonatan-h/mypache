import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Compute from "./pages/compute/Compute";
import Home from "./pages/home/Home";
import NewCluster from "./pages/new-cluster/NewCluster";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "compute",
        element: <Compute />,
      },

      {
        path: "compute/new-cluster",
        element: <NewCluster />,
      },
    ],
  },
]);
