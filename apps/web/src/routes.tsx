import React, { Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom";
import { AuthLayout } from "./auth/layouts/AuthLayout";

export const ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  TODOS: "/todos",
} as const;

const lazyRoutes = {
  LoginPage: React.lazy(() => import("./auth/pages/LoginPage")),
  SignupPage: React.lazy(() => import("./auth/pages/SignupPage")),
  TodoPage: React.lazy(() => import("./todo/pages/TodoPage")),
};

const routes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: (
          <Suspense fallback={null}>
            <lazyRoutes.LoginPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.SIGNUP,
        element: (
          <Suspense fallback={null}>
            <lazyRoutes.SignupPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: ROUTES.TODOS,
    element: (
      <Suspense fallback={null}>
        <lazyRoutes.TodoPage />
      </Suspense>
    ),
  },
  { path: "*", element: <Navigate to={ROUTES.LOGIN} replace /> },
];

export const router = createBrowserRouter(routes);
