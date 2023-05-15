class Api {
  constructor(options) {
    this._jwt = options.jwt || "";
    this._url = options.url || "";
    this._headers = options.headers || {};
  }

  _checkStatus(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Что-то пошло не так: ${res.status}`);
  }

  _request(url, options) {
    return fetch(url, options).then(this._checkStatus);
  }

  updateAuthorization(jwt) {
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

  addNewCard({ name, link }) {
    return this._request(`${this._url}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name,
        link,
      }),
    });
  }

  getProfileInfo() {
    return this._request(`${this._url}/users/me`, {
      headers: this._headers,
    });
  }

  changeProfileInfo({ name, description }) {
    return this._request(`${this._url}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about: description,
      }),
    });
  }

  deleteCard(id) {
    return this._request(`${this._url}/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    });
  }

  likeCard(card) {
    return this._request(`${this._url}/cards/${card._id}/likes`, {
      method: "PUT",
      headers: this._headers,
    });
  }

  deleteLike(card) {
    return this._request(`${this._url}/cards/${card._id}/likes`, {
      method: "DELETE",
      headers: this._headers,
    });
  }

  setNewAvatar({ imageAvatar }) {
    return this._request(`${this._url}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: imageAvatar,
      }),
    });
  }
}

const api = new Api({
  jwt: localStorage.getItem("jwt"),
  url: "https://api.mesto-rudokopov.nomoredomains.monster",
  headers: {
    authorization: localStorage.getItem("jwt"),
    "Content-Type": "application/json",
  },
});

export { api };
