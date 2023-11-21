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
const Transaction = lazy(() => import('src/pages/dashboard/transaction'));
const CommissionStats = lazy(() => import('src/pages/dashboard/commissionstats'));

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
            { path: 'transaction', element: <Transaction /> },
            { path: 'commissionstats', element: <CommissionStats /> }
        ]
    }
];
