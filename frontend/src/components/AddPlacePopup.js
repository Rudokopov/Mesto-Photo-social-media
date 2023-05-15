import React, { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props) {
  const { isOpen, onClose, onAddCard } = props;

  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    setName("");
    setLink("");
  }, [isOpen]);

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleLink = (e) => {
    setLink(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onAddCard({
      name,
      link,
    });
    onClose();
  };

  return (
    <PopupWithForm
      onClose={onClose}
      isOpen={isOpen}
      title="Новое место"
      name="place"
      btnName={"Создать"}
      onSubmit={handleSubmit}
    >
      <input
        name="name"
        onChange={handleName}
        placeholder="Название"
        value={name || ""}
        required
        type="text"
        className="popup__form-input popup__form-place-name"
        id="name"
        minLength="2"
        maxLength="30"
      />
      <span className="name-error error-message"></span>
      <input
        name="link"
        onChange={handleLink}
        placeholder="Ссылка на картинку"
        value={link || ""}
        required
        type="url"
        className="popup__form-input popup__form-place-link"
        id="image"
      />
      <span className="image-error error-message"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
