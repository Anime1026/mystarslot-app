import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// operator
const Cateigory = lazy(() => import('src/pages/game/categories'));
const Provider = lazy(() => import('src/pages/game/providers'));
const Games = lazy(() => import('src/pages/game/games'));

// ----------------------------------------------------------------------

export const gameRoutes = [
  {
    path: 'game-management',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <Cateigory />, index: true },
      { path: 'category', element: <Cateigory /> },
      { path: 'provider', element: <Provider /> },
      { path: 'game', element: <Games /> },
    ],
  },
];
