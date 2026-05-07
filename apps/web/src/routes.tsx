import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import { AuthLayout } from './components/layout/AuthLayout';

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
} as const;

const lazyRoutes = {
  LoginPage: React.lazy(() => import('./pages/LoginPage')),
  SignupPage: React.lazy(() => import('./pages/SignupPage')),
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
  { path: '*', element: <Navigate to={ROUTES.LOGIN} replace /> },
];

export const router = createBrowserRouter(routes);
