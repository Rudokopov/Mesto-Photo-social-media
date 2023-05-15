import React, { useRef } from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvattarPopup(props) {
  const { onEditAvatar } = props;

  const avatarInputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    onEditAvatar({
      imageAvatar: avatarInputRef.current.value,
    });
    e.target.reset();
  };

  const { isOpen, onClose } = props;
  return (
    <PopupWithForm
      onClose={onClose}
      isOpen={isOpen}
      title="Обновить аватар"
      name="avatar"
      btnName={"Сохранить"}
      onSubmit={handleSubmit}
    >
      <input
        ref={avatarInputRef}
        name="link"
        placeholder="Ссылка на картинку"
        required
        type="url"
        className="popup__form-input popup__form-avatar-link"
      />
      <span className="imageAvatar-error error-message"></span>
    </PopupWithForm>
  );
}

export default EditAvattarPopup;
