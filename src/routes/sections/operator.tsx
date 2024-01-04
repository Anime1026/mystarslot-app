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
const List = lazy(() => import('src/pages/operator/list'));
const Create = lazy(() => import('src/pages/operator/create'));
const Account = lazy(() => import('src/pages/operator/account'));

// shop
const ShopList = lazy(() => import('src/pages/shop/list'));
const ShopCreate = lazy(() => import('src/pages/shop/create'));
const ShopAccount = lazy(() => import('src/pages/shop/account'));

// user
const UserList = lazy(() => import('src/pages/user/list'));
const UserAccount = lazy(() => import('src/pages/user/account'));
const UserCreate = lazy(() => import('src/pages/user/create'));
// profile
const Profile = lazy(() => import('src/pages/profile'));

// bonus system
const BonusSystem = lazy(() => import('src/pages/bonussystem'));

// jackpot system
const JackpotHistory = lazy(() => import('src/pages/jackpot/history'));
const JackpotSettings = lazy(() => import('src/pages/jackpot/settings'));

// ----------------------------------------------------------------------

export const operatorRoutes = [
    {
        path: 'operator',
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
            { element: <List />, index: true },
            { path: 'list', element: <List /> },
            {
                path: 'account',
                children: [
                    {
                        path: ':id',
                        element: <Account />
                    }
                ]
            },
            { path: 'create', element: <Create /> }
        ]
    },
    {
        path: 'shop',
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
            { element: <ShopList />, index: true },
            { path: 'list', element: <ShopList /> },
            {
                path: 'account',
                children: [
                    {
                        path: ':id',
                        element: <ShopAccount />
                    }
                ]
            },
            { path: 'create', element: <ShopCreate /> }
        ]
    },
    {
        path: 'user',
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
            { element: <UserList />, index: true },
            { path: 'list', element: <UserList /> },
            {
                path: 'account',
                children: [
                    {
                        path: ':id',
                        element: <UserAccount />
                    }
                ]
            },
            { path: 'create', element: <UserCreate /> }
        ]
    },
    {
        path: 'profile',
        element: (
            <AuthGuard>
                <DashboardLayout>
                    <Suspense fallback={<LoadingScreen />}>
                        <Outlet />
                    </Suspense>
                </DashboardLayout>
            </AuthGuard>
        ),
        children: [{ element: <Profile />, index: true }]
    },
    {
        path: 'bonussystem',
        element: (
            <AuthGuard>
                <DashboardLayout>
                    <Suspense fallback={<LoadingScreen />}>
                        <Outlet />
                    </Suspense>
                </DashboardLayout>
            </AuthGuard>
        ),
        children: [{ element: <BonusSystem />, index: true }]
    },
    {
        path: 'jackpot',
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
            { element: <JackpotHistory />, index: true },
            { path: 'history', element: <JackpotHistory /> },
            { path: 'settings', element: <JackpotSettings /> }
        ]
    }
];
