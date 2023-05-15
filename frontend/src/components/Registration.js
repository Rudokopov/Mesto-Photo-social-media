import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import AuthForm from "./AuthForm";

function Registration(props) {
  const navigate = useNavigate();
  const { registration, loggedIn } = props;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const filter = (e) => {
    e.target.value = e.target.value.replace(/[а-я]/gi, "");
  };

  const handleEmail = (e) => {
    filter(e);
    setUsername(e.target.value);
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    filter(e);
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      registration(email, password);
    }
  };

  return (
    <>
      {loggedIn ? (
        navigate("/", { replace: true })
      ) : (
        <>
          <Header link={"/login"} linkName={"Войти"} />
          <AuthForm
            title="Регистрация"
            buttonText="Зарегистрироваться"
            handleSubmit={handleSubmit}
            handleEmail={handleEmail}
            handlePassword={handlePassword}
            description="Уже зарегестрированы?"
            link="/login"
            linkTitle="Войти"
          />
        </>
      )}
    </>
  );
}

export default Registration;
