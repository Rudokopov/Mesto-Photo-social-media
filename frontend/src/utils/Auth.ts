// auth.js

export const BASE_URL = "https://mesto-yandex.onrender.com";

export const checkStatus = (res: Response) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Что-то пошло не так: ${res.status}`);
};

export const request = (url: string, options: RequestInit) => {
  return fetch(url, options).then(checkStatus);
};

export const register = (email: string, password: string) => {
  return request(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
};

export const authorize = (email: string, password: string) => {
  return request(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
};

export const getContent = (token: string) => {
  return request(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
