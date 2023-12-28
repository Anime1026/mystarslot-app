import axios, { AxiosRequestConfig } from 'axios';
// config
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
    (res) => res,
    (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
    chat: '/api/chat',
    kanban: '/api/kanban',
    calendar: '/api/calendar',
    dashboard: {
        getUserTree: '/api/get-user-tree',
        getUserCounts: '/api/get-userCounts',
        getCategories: '/api/get-categories',
        getGameStatics: '/api/game-statics',
        sportsbookStatics: '/api/sports-statics',
        getProviders: '/api/get-providers',
        getTopInfos: '/api/get-topinfos',
        getGameDetail: '/api/get-gamedetail',
        getSportsDetail: '/api/get-sportsdetail'
    },
    auth: {
        me: '/api/auth/me',
        login: '/api/user-login',
        register: '/api/auth/register',
        password: '/api/change-password'
    },
    mail: {
        list: '/api/mail/list',
        details: '/api/mail/details',
        labels: '/api/mail/labels'
    },
    post: {
        list: '/api/post/list',
        details: '/api/post/details',
        latest: '/api/post/latest',
        search: '/api/post/search'
    },
    product: {
        list: '/api/product/list',
        details: '/api/product/details',
        search: '/api/product/search'
    },
    operator: {
        list: '/api/get-user',
        totalValue: '/api/total-value',
        create: 'api/user-create',
        update: '/api/user-update',
        remove: '/api/user-delete',
        changeCredit: '/api/change-credit',
        changeFido: '/api/change-fido',
        getSelectUser: '/api/get-select-user'
    },
    transaction: {
        get: '/api/get-transactions',
        getInOut: '/api/get-inoutAmount',
        getLatest: '/api/get-latestTransactions'
    },
    games: {
        allProviders: '/api/get-allprovider',
        addCategory: '/api/add-category',
        changeCategory: '/api/change-category'
    },
    get: {
        getFamily: '/api/get-family'
    },
    users: {
        updatePassword: '/api/update-password',
        updateMany: '/api/update-many-users',
        deleteMany: '/api/delete-many-users'
    },
    bonus: {
        setting: '/api/bonus-setting',
        getSetting: '/api/get-bonus-setting'
    }
};
