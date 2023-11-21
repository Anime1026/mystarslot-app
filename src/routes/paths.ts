// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  OPERATOR: '/operator',
  SHOP: '/shop',
  USER: '/user',
  PROFILE: '/profile',
  GAMES: '/game-management',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    usertree: `${ROOTS.DASHBOARD}/usertree`,
    gamestatics: `${ROOTS.DASHBOARD}/gamestatics`,
    transaction: `${ROOTS.DASHBOARD}/transaction`,
    commission: `${ROOTS.DASHBOARD}/commissionstats`,
  },
  // game management
  games: {
    index: `${ROOTS.GAMES}`,
    category: `${ROOTS.GAMES}/category`,
    provider: `${ROOTS.GAMES}/provider`,
    game: `${ROOTS.GAMES}/game`,
  },
  // Operators
  operator: {
    index: `${ROOTS.OPERATOR}`,
    list: `${ROOTS.OPERATOR}/list`,
    create: `${ROOTS.OPERATOR}/create`,
    edit: (id: string) => `${ROOTS.OPERATOR}/account/${id}`,
  },
  shop: {
    index: `${ROOTS.SHOP}`,
    list: `${ROOTS.SHOP}/list`,
    create: `${ROOTS.SHOP}/create`,
    edit: (id: string) => `${ROOTS.SHOP}/account/${id}`,
  },
  user: {
    index: `${ROOTS.USER}`,
    list: `${ROOTS.USER}/list`,
    edit: (id: string) => `${ROOTS.USER}/account/${id}`,
  },
  profile: {
    index: `${ROOTS.PROFILE}`,
  },
};
