import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

const AUTH_TOKEN_KEY = "auth_token";

export async function saveToken(token: string) {
  await setItemAsync(AUTH_TOKEN_KEY, token);
}

export async function getToken() {
  return await getItemAsync(AUTH_TOKEN_KEY);
}

export async function deleteToken() {
  await deleteItemAsync(AUTH_TOKEN_KEY);
}
