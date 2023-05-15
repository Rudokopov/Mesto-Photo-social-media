function RequestPopup(props) {
  const { isOpen, title, onClose, image, closeByOverlay } = props;
  return (
    <div
      className={isOpen ? `popup popup_opened` : `popup`}
      onClick={closeByOverlay}
    >
      <div className="popup__container">
        <button
          type="button"
          aria-label="Закрыть форму"
          className="popup__form-close-button"
          onClick={onClose}
        ></button>
        <img src={image} className="popup__image" />
        <h2 className="popup__request-title">{title}</h2>
      </div>
    </div>
  );
}

export default RequestPopup;
