import React from "react";
import { useContext } from "react";
import Card from "./Card";
import Header from "./Header";
import { CurrentUserCardsContext } from "../contexts/CurrentUserCardsContext";
import { LoadingContext } from "../contexts/LoadingContext";
import Loaded from "./Loaded";

function Main({
  onEditProfile,
  onAvatarPopup,
  onPlacePopup,
  onCardClick,
  onCardLike,
  onCardDelete,
  currentUser,
  signOut,
}) {
  const cards = useContext(CurrentUserCardsContext);
  const isLoading = useContext(LoadingContext);
  const reverseCards = [...cards].reverse();
  return (
    <>
      {isLoading && <Loaded />}
      <Header signOut={signOut} />
      <main className="content">
        <section className="profile">
          <div className="profile__avatar-wrap">
            <img
              src={currentUser.avatar}
              alt="Аватар пользователя"
              className="profile__avatar"
            />
            <button
              type="button"
              className="profile__avatar-wrap-button"
              onClick={onAvatarPopup}
            ></button>
          </div>
          <div className="profile__info">
            <button
              type="button"
              aria-label="Открытие формы с редактированием профиля"
              className="profile__edit-button"
              onClick={onEditProfile}
            ></button>
            <h1 className="profile__user-name">{currentUser.name}</h1>
            <p className="profile__user-description">{currentUser.about}</p>
          </div>
          <button
            type="button"
            aria-label="Открытие формы с добавлением места"
            className="profile__add-button"
            onClick={onPlacePopup}
          ></button>
        </section>
        <section className="cards">
          {reverseCards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />
          ))}
        </section>
      </main>
    </>
  );
}

export default Main;
