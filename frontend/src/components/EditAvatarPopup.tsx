import React, { useRef } from "react";
import PopupWithForm from "./PopupWithForm";

type EditAvatarPopupProps = {
  onEditAvatar: (avatarLink: string) => void;
  isOpen: boolean;
  onClose: () => void;
};

const EditAvattarPopup: React.FC<EditAvatarPopupProps> = (props) => {
  const { onEditAvatar } = props;

  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const avatarLink = avatarInputRef?.current?.value;

    if (avatarLink) {
      onEditAvatar(avatarLink);
    }

    e.currentTarget.reset();
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
};

export default EditAvattarPopup;
