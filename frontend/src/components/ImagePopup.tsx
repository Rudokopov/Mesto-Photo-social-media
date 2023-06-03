import React from "react";
import { CardData } from "./App";

type ImagePopupProps = {
  onClose: () => void;
  selectedCard: CardData | undefined;
  closeByOverlay: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const ImagePopup: React.FC<ImagePopupProps> = (props) => {
  const { onClose, selectedCard, closeByOverlay } = props;
  return (
    <div
      className={
        selectedCard?.name ? `popup popup-image popup_opened` : `popup`
      }
      onClick={closeByOverlay}
    >
      <div className="popup-image__container">
        <button
          type="button"
          aria-label="Закрыть форму"
          className="popup__form-close-button popup__form-image-close-button"
          onClick={onClose}
        ></button>
        <img
          className="popup-image__photo"
          src={selectedCard?.link}
          alt={selectedCard?.name}
        />
        <p className="popup-image__text">{selectedCard?.name}</p>
      </div>
    </div>
  );
};

export default ImagePopup;
