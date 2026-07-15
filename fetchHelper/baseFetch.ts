import { getToken } from "../service/authToken";

//TODO: add url in .env and import it from there
const baseUrl = "http://192.168.1.9:3000";

export async function getFetch(route: string) {
  const token = await getToken();
  const response = await fetch(`${baseUrl}${route}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
}

export async function postFetch(route: string, body: object) {
  const token = await getToken();
  const response = await fetch(`${baseUrl}${route}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  console.log("PostFetch: ", data);
  return data;
}

export async function postLoginFetch(route: string, body: object) {
  const response = await fetch(`${baseUrl}${route}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  console.log(response);
  const data = await response.json();

  return data;
}
