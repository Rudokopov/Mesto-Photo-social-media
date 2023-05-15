import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import AuthForm from "./AuthForm";

function Authorization(props) {
  const navigate = useNavigate();
  const { authorization } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const filter = (e) => {
    e.target.value = e.target.value.replace(/[а-я]/gi, "");
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    filter(e);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    filter(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }
    authorization(email, password, { navigate });
  };

  return (
    <>
      <Header link={"/registration"} linkName={"Регистрация"} />
      <AuthForm
        title="Вход"
        buttonText="Войти"
        handleSubmit={handleSubmit}
        handleEmail={handleEmail}
        handlePassword={handlePassword}
      />
    </>
  );
}

export default Authorization;
