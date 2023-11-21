// utils
import axios, { endpoints } from 'src/utils/axios';

// ---------------------------------------------------------------------- zeus casino --------------------------

// casino all games
export async function getList(data: any) {
    const gameList = endpoints.operator.list;
    const res = await axios.post(gameList, data);
    return res;
}

export async function create(data: any) {
    const res = await axios.post(endpoints.operator.create, data);
    return res.data;
}

export async function update(data: any) {
    const res = await axios.post(endpoints.operator.update, data);
    return res.data;
}

export async function updateProfile(data: any) {
    const res = await axios.post(endpoints.auth.password, data);
    return res.data;
}

export async function remove(data: any) {
    const res = await axios.post(endpoints.operator.remove, data);
    return res.data;
}

export async function getUserTree() {
    const res = await axios.get(endpoints.dashboard.getUserTree);
    return res.data;
}

export async function getCategories() {
    const res = await axios.get(endpoints.operator.getCategories);
    return res.data;
}

export async function getTransactions() {
    const res = await axios.get(endpoints.transaction.get);
    return res.data;
}

// add game-management

export async function allProviders() {
    const res = await axios.get(endpoints.games.allProviders);
    return res.data;
}

export async function addCategory(data: any) {
    const res = await axios.post(endpoints.games.addCategory, data);
    return res.data;
}
