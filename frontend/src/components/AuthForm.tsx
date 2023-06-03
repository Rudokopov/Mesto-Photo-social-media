import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LoadingContext } from "../contexts/LoadingContext";

type AuthFormProps = {
  title: string;
  buttonText: string;
  description?: string;
  link?: string;
  linkTitle?: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const AuthForm: React.FC<AuthFormProps> = (props) => {
  const isLoading = useContext(LoadingContext);
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
        </fieldset>
        <button
          className={
            isLoading
              ? "authorization__submit-button-download authorization__submit-button"
              : "authorization__submit-button"
          }
          type="submit"
        >
          {isLoading ? "Загрузка..." : buttonText}
        </button>
        <p className="authorization__description">
          {description}
          {link && (
            <Link to={link} className="authorization__description-link">
              {linkTitle}
            </Link>
          )}
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
