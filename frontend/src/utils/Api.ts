import { CardData } from "../components/App";

interface ApiOptions {
  jwt?: string | null;
  url?: string;
  headers?: Record<string, string>;
}

class Api {
  private _jwt: string;
  private _url: string;
  private _headers: Record<string, string>;
  constructor(options: ApiOptions) {
    this._jwt = options.jwt || "";
    this._url = options.url || "";
    this._headers = options.headers || {};
  }

  private _checkStatus<T>(res: Response) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Что-то пошло не так: ${res.status}`);
  }

  private _request<T>(url: string, options: RequestInit) {
    return fetch(url, options).then((res) => this._checkStatus<T>(res));
  }

  updateAuthorization(jwt: string) {
    this._jwt = jwt;
    this._headers.authorization = jwt;
  }

  getMyUserId() {
    this._request(`${this._url}/users/me`, {
      headers: this._headers,
    });
  }

  getInitialCards() {
    return this._request(`${this._url}/cards`, {
      headers: this._headers,
    });
  }

  addNewCard(name: string, image: string) {
    return this._request(`${this._url}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name,
        link: image,
      }),
    });
  }

  getProfileInfo() {
    return this._request(`${this._url}/users/me`, {
      headers: this._headers,
    });
  }

  changeProfileInfo(name: string, description: string) {
    return this._request(`${this._url}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about: description,
      }),
    });
  }

  deleteCard(id: string) {
    return this._request(`${this._url}/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    });
  }

  likeCard(card: CardData) {
    return this._request(`${this._url}/cards/${card._id}/likes`, {
      method: "PUT",
      headers: this._headers,
    });
  }

  deleteLike(card: CardData) {
    return this._request(`${this._url}/cards/${card._id}/likes`, {
      method: "DELETE",
      headers: this._headers,
    });
  }

  setNewAvatar(imageAvatar: string) {
    return this._request(`${this._url}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: imageAvatar,
      }),
    });
  }
}

const apiOptions: ApiOptions = {
  jwt: localStorage.getItem("jwt"),
  url: "https://mesto-yandex.onrender.com",
  headers: {
    authorization: localStorage.getItem("jwt") || "",
    "Content-Type": "application/json",
  },
};

const api = new Api(apiOptions);

export { api };
