// ----------------------------------------------------------------------

const ROOTS = {
    AUTH: '/auth',
    DASHBOARD: '/dashboard',
    OPERATOR: '/operator',
    SHOP: '/shop',
    USER: '/user',
    PROFILE: '/profile',
    GAMES: '/game-management',
    BONUSSYSTEM: '/bonussystem',
    JACKPOT: '/jackpot'
};

// ----------------------------------------------------------------------

export const paths = {
    minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
    // AUTH
    auth: {
        jwt: {
            login: `${ROOTS.AUTH}/jwt/login`,
            register: `${ROOTS.AUTH}/jwt/register`
        }
    },
    // DASHBOARD
    dashboard: {
        root: ROOTS.DASHBOARD,
        usertree: `${ROOTS.DASHBOARD}/usertree`,
        gamestatics: `${ROOTS.DASHBOARD}/gamestatics`,
        sportsstatics: `${ROOTS.DASHBOARD}/sportsstatics`,
        transaction: `${ROOTS.DASHBOARD}/transaction`,
        commission: `${ROOTS.DASHBOARD}/commissionstats`,
        gamedetail: (id: string) => `${ROOTS.DASHBOARD}/gamedetail/${id}`,
        sportsdetail: (id: string) => `${ROOTS.DASHBOARD}/sportsdetail/${id}`
    },
    // game management
    games: {
        index: `${ROOTS.GAMES}`,
        category: `${ROOTS.GAMES}/category`,
        provider: `${ROOTS.GAMES}/provider`,
        game: `${ROOTS.GAMES}/game`
    },
    // Operators
    operator: {
        index: `${ROOTS.OPERATOR}`,
        list: `${ROOTS.OPERATOR}/list`,
        create: `${ROOTS.OPERATOR}/create`,
        edit: (id: string) => `${ROOTS.OPERATOR}/account/${id}`
    },
    // jackpot
    jackpot: {
        index: `${ROOTS.JACKPOT}`,
        history: `${ROOTS.JACKPOT}/history`,
        settings: `${ROOTS.JACKPOT}/settings`
    },
    shop: {
        index: `${ROOTS.SHOP}`,
        list: `${ROOTS.SHOP}/list`,
        create: `${ROOTS.SHOP}/create`,
        edit: (id: string) => `${ROOTS.SHOP}/account/${id}`
    },
    user: {
        index: `${ROOTS.USER}`,
        list: `${ROOTS.USER}/list`,
        edit: (id: string) => `${ROOTS.USER}/account/${id}`,
        create: `${ROOTS.USER}/create`
    },
    profile: {
        index: `${ROOTS.PROFILE}`
    },
    bonussystem: {
        index: `${ROOTS.BONUSSYSTEM}`
    }
};
