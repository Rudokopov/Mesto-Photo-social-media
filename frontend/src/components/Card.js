import React, { useContext, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card(props) {
  const { card, onCardClick, onCardLike, onCardDelete } = props;
  const currentUser = useContext(CurrentUserContext);

  const isOwn = card.owner._id === currentUser._id || "";
  const isLiked = card.likes.some((i) => i._id === currentUser._id);

  const handleDeleteClick = () => {
    const id = card._id;
    onCardDelete(id);
  };

  return (
    <div className="card">
      <img
        className="card__image"
        alt={card.name}
        src={card.link}
        onClick={() => onCardClick(card)}
      />
      <button
        className={`${isOwn ? "card__trash-button" : "disabled-element"} `}
        onClick={handleDeleteClick}
      ></button>
      <div className="card__bottom">
        <h2 className="card__description">{card.name}</h2>
        <div className="card__tools">
          <button
            className={`${
              isLiked
                ? "card__heart-button card__heart-button_active"
                : "card__heart-button"
            }`}
            onClick={() => onCardLike(card)}
          ></button>
          <span className="card__heart-count">{card.likes.length}</span>
        </div>
      </div>
    </div>
  );
}

export default Card;
