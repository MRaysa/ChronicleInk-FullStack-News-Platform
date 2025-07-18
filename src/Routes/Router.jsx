import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import AllArticles from "../pages/AllArticles";
import ArticleDetails from "../pages/ArticleDetails";
import PrivateLayout from "../layouts/PrivateLayout";
import Subscription from "../pages/Subscription";
import MyProfile from "../pages/MyProfile";
import PremiumArticles from "../pages/PremiumArticles";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../components/Dashboard/AdminDashboard";
import NotFound from "../pages/NotFound";
import App from "../App";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateAuth from "../components/PrivateAuth";
import AddArticleForm from "../pages/AddArticle";
import MyArticles from "../pages/MyArticles";
import ManageUsers from "../components/Dashboard/ManageUsers";
import ManageArticles from "../components/Dashboard/ManageArticles";
import AddPublisher from "../components/Dashboard/AddPublisher";
import PrivateRoute from "../components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "/all-articles", element: <AllArticles /> },
      { path: "/article/:id", element: <ArticleDetails /> },
      {
        path: "/login",
        element: (
          <PrivateAuth>
            <Login />
          </PrivateAuth>
        ),
      },
      {
        path: "/register",
        element: (
          <PrivateAuth>
            <Register />
          </PrivateAuth>
        ),
      },
    ],
  },
  {
    path: "/user",
    element: <PrivateLayout />,
    children: [
      {
        path: "/user/add-article",
        element: (
          <PrivateRoute>
            <AddArticleForm />
          </PrivateRoute>
        ),
      },
      {
        path: "/user/subscription",
        element: (
          <PrivateRoute>
            <Subscription />
          </PrivateRoute>
        ),
      },
      {
        path: "/user/my-profile",
        element: (
          <PrivateRoute>
            <MyProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "/user/premium-articles",
        element: (
          <PrivateRoute>
            <PremiumArticles />
          </PrivateRoute>
        ),
      },
      {
        path: "/user/my-articles",
        element: (
          <PrivateRoute>
            <MyArticles />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "/admin/dashboard",
        element: (
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/admin/mange-users",
        element: (
          <PrivateRoute>
            <ManageUsers />
          </PrivateRoute>
        ),
      },
      {
        path: "/admin/manage-articles",
        element: (
          <PrivateRoute>
            <ManageArticles />
          </PrivateRoute>
        ),
      },
      {
        path: "/admin/publisher",
        element: (
          <PrivateRoute>
            <AddPublisher />{" "}
          </PrivateRoute>
        ),
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
