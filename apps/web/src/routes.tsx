import React, { Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom";
import { AuthLayout } from "@/auth/layouts/AuthLayout";

export const ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  TODOS: "/todos",
  TRASH: "/todos/trash",
  SETTINGS: "/settings",
  SETTINGS_PROFILE: "/settings/profile",
  SETTINGS_PASSWORD: "/settings/password",
  SETTINGS_ACCOUNT_LINK: "/settings/account-link",
  SETTINGS_WITHDRAW: "/settings/withdraw",
} as const;

const lazyRoutes = {
  LoginPage: React.lazy(() => import("@/auth/pages/LoginPage")),
  SignupPage: React.lazy(() => import("@/auth/pages/SignupPage")),
  TodoPage: React.lazy(() => import("@/todo/pages/TodoPage")),
  TrashPage: React.lazy(() => import("@/todo/pages/TrashPage")),
  AccountSettingsLayout: React.lazy(
    () => import("@/account/layouts/AccountSettingsLayout"),
  ),
  ProfileEditPage: React.lazy(() => import("@/account/pages/ProfileEditPage")),
  PasswordChangePage: React.lazy(
    () => import("@/account/pages/PasswordChangePage"),
  ),
  SettingsStubPage: React.lazy(
    () => import("@/account/pages/SettingsStubPage"),
  ),
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
  {
    path: ROUTES.TRASH,
    element: (
      <Suspense fallback={null}>
        <lazyRoutes.TrashPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.SETTINGS,
    element: (
      <Suspense fallback={null}>
        <lazyRoutes.AccountSettingsLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.SETTINGS_PROFILE} replace />,
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={null}>
            <lazyRoutes.ProfileEditPage />
          </Suspense>
        ),
      },
      {
        path: "password",
        element: (
          <Suspense fallback={null}>
            <lazyRoutes.PasswordChangePage />
          </Suspense>
        ),
      },
      {
        path: "account-link",
        element: (
          <Suspense fallback={null}>
            <lazyRoutes.SettingsStubPage />
          </Suspense>
        ),
      },
      {
        path: "withdraw",
        element: (
          <Suspense fallback={null}>
            <lazyRoutes.SettingsStubPage />
          </Suspense>
        ),
      },
    ],
  },
  { path: "*", element: <Navigate to={ROUTES.LOGIN} replace /> },
];

export const router = createBrowserRouter(routes);
