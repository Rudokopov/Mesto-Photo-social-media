import React, { useState, useEffect, useContext } from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { DataUser } from "./App";

type EditProfilePopupProps = {
  onClose: () => void;
  isOpen: boolean;
  onUpdateUser: (name: string, about: string) => void;
};

const EditProfilePopup: React.FC<EditProfilePopupProps> = (props) => {
  const { onClose, isOpen, onUpdateUser } = props;
  const [name, setName] = useState("");
  const [description, setAbout] = useState("");
  const userData = useContext<DataUser | undefined>(CurrentUserContext);

  useEffect(() => {
    setName(userData ? userData.name : "");
    setAbout(userData ? userData.about : "");
  }, [isOpen, userData]);

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAbout(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdateUser(name, description);
  };

  return (
    <PopupWithForm
      onClose={onClose}
      isOpen={isOpen}
      title="Редактировать профиль"
      name="edit"
      btnName="Сохранить"
      onSubmit={handleSubmit}
    >
      <input
        name="name"
        value={name || ""}
        placeholder="Имя"
        required
        type="text"
        className="popup__form-input popup__form-user-name"
        minLength={2}
        maxLength={30}
        onChange={handleChangeName}
      />
      <span className="user-error error-message"></span>
      <input
        name="name"
        value={description || ""}
        placeholder="Описание"
        required
        type="text"
        className="popup__form-input popup__form-user-description"
        minLength={2}
        maxLength={30}
        onChange={handleChangeDescription}
      />
      <span className="description-error error-message"></span>
    </PopupWithForm>
  );
};

export default EditProfilePopup;
