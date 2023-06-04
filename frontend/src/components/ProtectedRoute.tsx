import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import { CardData, DataUser } from "./App";
import { MainProps } from "./Main";

type ProtectedRouteElementProps = {
  onEditProfile: () => void;
  onAvatarPopup: () => void;
  onPlacePopup: () => void;
  onCardClick: (card: CardData) => void;
  onCardLike: (card: CardData) => void;
  onCardDelete: (id: string) => void;
  cards: CardData[];
  currentUser: DataUser | undefined;
  email: string;
  signOut: () => void;
  element: React.ComponentType<MainProps>;
};

const ProtectedRouteElement: React.FC<ProtectedRouteElementProps> = (props) => {
  const { element: Component, ...data } = props;
  const loggedIn = useContext(AppContext);
  return loggedIn ? (
    <Component {...data} />
  ) : (
    <Navigate to="/login" replace={true} />
  );
};

export default ProtectedRouteElement;
