import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import EditPage from "./pages/EditPages";
import ListPage from "./pages/ListPage";
import RequireAuth from "./pages/components/RequireAuth";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RequireAuth />}>
        <Route index element={<EditPage />} />
        <Route path="list" element={<ListPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}
