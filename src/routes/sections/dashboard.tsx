import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/dashboard'));
const UserTree = lazy(() => import('src/pages/dashboard/usertree'));
const GameStatics = lazy(() => import('src/pages/dashboard/gamestatics'));
const SportsStatics = lazy(() => import('src/pages/dashboard/sportsstatics'));
const Transaction = lazy(() => import('src/pages/dashboard/transaction'));
const CommissionStats = lazy(() => import('src/pages/dashboard/commissionstats'));
const GameDetail = lazy(() => import('src/pages/dashboard/gamedetail'));
const SportsDetail = lazy(() => import('src/pages/dashboard/sportsdetail'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
    {
        path: 'dashboard',
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
            { element: <IndexPage />, index: true },
            { path: 'usertree', element: <UserTree /> },
            { path: 'gamestatics', element: <GameStatics /> },
            {
                path: 'gamedetail',
                children: [
                    {
                        path: ':id',
                        element: <GameDetail />
                    }
                ]
            },
            {
                path: 'sportsdetail',
                children: [
                    {
                        path: ':id',
                        element: <SportsDetail />
                    }
                ]
            },
            { path: 'sportsstatics', element: <SportsStatics /> },
            { path: 'transaction', element: <Transaction /> },
            { path: 'commissionstats', element: <CommissionStats /> }
        ]
    }
];
