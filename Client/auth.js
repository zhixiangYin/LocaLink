// auth.js
import * as SecureStore from 'expo-secure-store';

export async function saveUserId(userId) {
    await SecureStore.setItemAsync('userId', userId);
}

export async function getUserId() {
    return await SecureStore.getItemAsync('userId');
}

export async function saveUsername(username) {
    await SecureStore.setItemAsync('username', username);
}

export async function getUsername() {
    const username = await SecureStore.getItemAsync('username');
    return username;
}

export async function logout() {
    await SecureStore.deleteItemAsync('userId');
    await SecureStore.deleteItemAsync('username');
}
