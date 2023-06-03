import React, { useState } from "react";
import Header from "./Header";
import AuthForm from "./AuthForm";

type AuthorizationProps = {
  authorization: (name: string, email: string) => void;
};

const Authorization: React.FC<AuthorizationProps> = (props) => {
  const { authorization } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const filter = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[а-я]/gi, "");
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    filter(e);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    filter(e);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }
    authorization(email, password);
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
};

export default Authorization;
