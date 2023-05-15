import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import { EmailContext } from "../contexts/EmailContext";

function Header(props) {
  const loggedIn = useContext(AppContext);
  const email = useContext(EmailContext);
  const { link, linkName, signOut } = props;

  // Функция для выхода из приложения
  return (
    <header className="header">
      <Link to="/" className="header__logo"></Link>

      {loggedIn ? (
        <div className="header__multitool">
          <p className="header__email">{email}</p>
          <button className="header__link" onClick={signOut}>
            Выйти
          </button>
        </div>
      ) : (
        <Link className="header__link" to={link}>
          {linkName}
        </Link>
      )}
    </header>
  );
}

export default Header;
