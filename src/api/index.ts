// utils
import axios, { endpoints } from 'src/utils/axios';

// ---------------------------------------------------------------------- zeus casino --------------------------

// casino all games
export async function getList(data: any) {
    const gameList = endpoints.operator.list;
    const res = await axios.post(gameList, data);
    return res;
}

export async function getUserTotalValue(data: any) {
    const res = await axios.post(endpoints.operator.totalValue, data);
    return res.data;
}

export async function create(data: any) {
    const res = await axios.post(endpoints.operator.create, data);
    return res.data;
}

export async function update(data: any) {
    const res = await axios.post(endpoints.operator.update, data);
    return res.data;
}

export async function updateMany(data: any) {
    const res = await axios.post(endpoints.users.updateMany, data);
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

export async function deleteMany(data: any) {
    const res = await axios.post(endpoints.users.deleteMany, data);
    return res.data;
}

export async function getUserTree() {
    const res = await axios.get(endpoints.dashboard.getUserTree);
    return res.data;
}

export async function getCategories() {
    const res = await axios.get(endpoints.dashboard.getCategories);
    return res.data;
}

export async function getProviders() {
    const res = await axios.post(endpoints.dashboard.getProviders);
    return res.data;
}

// transactions
export async function getTransactions() {
    const res = await axios.get(endpoints.transaction.get);
    return res.data;
}

export async function getInOutAmount(data: any) {
    const res = await axios.post(endpoints.transaction.getInOut, data);
    return res.data;
}

export async function getLatestTransactions() {
    const res = await axios.get(endpoints.transaction.getLatest);
    return res.data;
}

export async function getUserCounts() {
    const res = await axios.get(endpoints.dashboard.getUserCounts);
    return res.data;
}

export async function getFamily(username: string) {
    const res = await axios.post(endpoints.get.getFamily, { username });
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

export async function changeCredit(data: any) {
    const res = await axios.post(endpoints.operator.changeCredit, data);
    return res.data;
}

export async function changeFido(data: any) {
    const res = await axios.post(endpoints.operator.changeFido, data);
    return res.data;
}

// dashboard

export async function getGameStatics(data: any) {
    const res = await axios.post(endpoints.dashboard.getGameStatics, data);
    return res.data;
}

export async function gettopInfos() {
    const res = await axios.get(endpoints.dashboard.getTopInfos);
    return res.data;
}

// get select user

export async function getSelectUser(params: any) {
    const res = await axios.post(endpoints.operator.getSelectUser, params);
    return res.data;
}

export async function updatePassword(data: any) {
    const res = await axios.post(endpoints.users.updatePassword, data);
    return res.data;
}

// change category

export async function changeCategories(data: any) {
    const res = await axios.post(endpoints.games.changeCategory, data);
    return res.data;
}

// bonus setting
export async function bonusSetting(data: any) {
    const res = await axios.post(endpoints.bonus.setting, data);
    return res.data;
}

export async function getBonusSetting() {
    const res = await axios.get(endpoints.bonus.getSetting);
    return res.data;
}
