import React from "react";
import { Link } from "react-router-dom";

function AuthForm(props) {
  const {
    title,
    buttonText,
    description,
    link,
    linkTitle,
    handleSubmit,
    handleEmail,
    handlePassword,
  } = props;
  return (
    <div className="authorization__container">
      <h2 className="authorization__title">{title}</h2>
      <form className="authorization__form" onSubmit={handleSubmit}>
        <fieldset className="authorization__top-fieldset">
          <input
            required
            placeholder="Email"
            className="authorization__input"
            name="email"
            type="email"
            onChange={handleEmail}
          />
          <input
            required
            placeholder="Password"
            className="authorization__input"
            name="password"
            type="password"
            minLength={2}
            onChange={handlePassword}
          />
          {/* {isErrorMessage && (
            <span className="error-message">
              Пароль не должен содержать русские символы
            </span>
          )} */}
        </fieldset>
        <button className="authorization__submit-button" type="submit">
          {buttonText}
        </button>
        <p className="authorization__description">
          {description} {""}
          <Link to={link} className="authorization__description-link">
            {linkTitle}
          </Link>
        </p>
      </form>
    </div>
  );
}

export default AuthForm;
