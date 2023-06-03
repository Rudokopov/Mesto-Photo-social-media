import React, { useState, useEffect, useCallback } from "react";
import { api } from "../utils/Api";
import { AppContext } from "../contexts/AppContext";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { CurrentUserCardsContext } from "../contexts/CurrentUserCardsContext";
import { LoadingContext } from "../contexts/LoadingContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvattarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { EmailContext } from "../contexts/EmailContext";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

import ProtectedRouteElement from "./ProtectedRoute";
import Authorization from "./Authorization";
import Registration from "./Registration";
import PageNotFound404 from "./PageNotFound404";
import RequestPopup from "./RequestPopup";
import * as auth from "../utils/Auth";

import imageSucess from "../images/Icons/Sucess.png";
import imageBad from "../images/Icons/Bad.png";

export type CardOwner = {
  about: string;
  avatar: string;
  cohort: string;
  name: string;
  _id: string;
};

export interface CardData {
  likes: DataUser[];
  link: string;
  name: string;
  owner: CardOwner;
  _id: string;
}

export interface DataUser {
  about: string;
  avatar: string;
  email: string;
  name: string;
  _id: string;
}

interface ServerResponse {
  token: string;
}

const App: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [loggedIn, setloggedIn] = useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAvatarPopupOpen, setAvatarPopupOpen] = useState(false);
  const [isPlacePopupOpen, setPlacePopupOpen] = useState(false);
  const [isRequestSucessPopupOpen, setRequestSucessPopupOpen] = useState(false);
  const [isRequestBadPopupOpen, setRequestBadPopupOpen] = useState(false);

  const [selectedCard, setSelectedCard] = useState<CardData>();
  const [currentUser, setCurrentUser] = useState<DataUser>();
  const [cards, setCards] = useState<CardData[]>();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    setLoading(true);
    tokenCheck();
  }, []);

  useEffect(() => {}, [isPlacePopupOpen]);

  const udpateCardsData = useCallback(async () => {
    await api.getInitialCards().then((data: CardData[]) => setCards(data));
    setLoading(false);
  }, []);

  const closeByOverlay = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("popup_opened")) {
      handleClosePopup();
    }
  };

  const requestUserData = () => {
    Promise.all([api.getProfileInfo(), api.getInitialCards()])
      .then(([userData, cards]) => {
        const transformUserData = userData as DataUser;
        const transformCardsData = cards as CardData[];
        setCurrentUser(transformUserData);
        setCards(transformCardsData);
        setUserEmail(transformUserData.email);
      })
      .then(() => {
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const tokenCheck = () => {
    const token = localStorage.getItem("jwt");
    try {
      if (token) {
        handleLogin();
        navigate("/", { replace: true });
        api.updateAuthorization(token);
        requestUserData(); // вызов функции для обновления данных
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const signOut = () => {
    localStorage.removeItem("jwt");
    setloggedIn(false);
    setUserEmail("");
    <Navigate to="/login" replace={true} />;
  };

  const registration = (email: string, password: string) => {
    auth
      .register(email, password)
      .then(() => {
        handleRequestSucessPopupOpen();
        navigate("/login", { replace: true });
      })
      .catch((err: Error) => {
        console.log(err.message);
        handleRequestBadPopupOpen();
      });
  };

  const authorization = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      // isLoading(true);
      await auth.authorize(email, password).then((data: ServerResponse) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          handleLogin();
          navigate("/", { replace: true });
          tokenCheck();
        }
        return;
      });
    } catch (err) {
      alert("Произошла ошибка при авторизации");
    }
  }, []);

  const handleCardLike = (card: CardData) => {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser?._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    if (!isLiked) {
      api
        .likeCard(card)
        .then((newCard: CardData) => {
          setCards((state) =>
            state?.map((c) => (c._id === card._id ? newCard : c))
          );
          udpateCardsData();
        })
        .catch((err: Error) => console.log(err));
    } else {
      api
        .deleteLike(card)
        .then((newCard: CardData) => {
          setCards((state) =>
            state?.map((c) => (c._id === card._id ? newCard : c))
          );
          udpateCardsData();
        })
        .catch((err: Error) => console.log(err));
    }
  };

  const handleUpdateUser = useCallback(
    async (name: string, description: string) => {
      try {
        setLoading(true);
        const updatedUser: DataUser = await api.changeProfileInfo(
          name,
          description
        );
        if (updatedUser) {
          setCurrentUser(updatedUser);
          handleClosePopup();
          setLoading(false);
        }
      } catch (err) {
        alert(`При обновлении пользователя произошла ошибка`);
      }
    },
    []
  );

  const handleCardDelete = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const deletedCard = await api.deleteCard(id);
      if (deletedCard) {
        setCards((prevCards) => prevCards?.filter((card) => card._id !== id));
        setLoading(false);
      }
    } catch (err) {
      alert(`При удалении карточки произошла ошибка`);
    }
  }, []);

  const handleAvatarChange = useCallback(async (imageAvatar: string) => {
    try {
      setLoading(true);
      const newAwatar = await api.setNewAvatar(imageAvatar);
      if (newAwatar) {
        setCurrentUser(newAwatar);
        handleClosePopup();
        setLoading(false);
      }
    } catch (err) {
      alert(`При обновлении аватара произошла ошибка`);
    }
  }, []);

  const handleAddPlaceSubmit = useCallback(
    async (name: string, link: string) => {
      try {
        setLoading(true);
        const newCard: CardData = await api.addNewCard(name, link);
        if (newCard) {
          if (cards) {
            setCards([newCard, ...cards]);
          }
          udpateCardsData();
          handleClosePopup();
        }
      } catch (err) {
        alert(`Произошла ошибка`);
      }
    },
    []
  );

  const handleLogin = useCallback(() => {
    setloggedIn(true);
  }, []);

  const handleCardClick = useCallback((card: CardData) => {
    setSelectedCard(card);
  }, []);

  const handleEditPopupOpen = () => {
    setEditProfilePopupOpen(true);
  };

  const handleAvatarPopupOpen = () => {
    setAvatarPopupOpen(true);
  };

  const handlePlacePopupOpen = () => {
    setPlacePopupOpen(true);
  };

  const handleRequestSucessPopupOpen = () => {
    setRequestSucessPopupOpen(true);
  };

  const handleRequestBadPopupOpen = () => {
    setRequestBadPopupOpen(true);
  };

  const handleClosePopup = () => {
    setSelectedCard(undefined);
    setAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setPlacePopupOpen(false);
    setRequestBadPopupOpen(false);
    setRequestSucessPopupOpen(false);
  };

  return (
    <>
      {cards && currentUser && (
        <LoadingContext.Provider value={isLoading}>
          <CurrentUserContext.Provider value={currentUser}>
            <CurrentUserCardsContext.Provider value={cards}>
              <AppContext.Provider value={loggedIn}>
                <EmailContext.Provider value={userEmail}>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <ProtectedRouteElement
                          onEditProfile={handleEditPopupOpen}
                          onAvatarPopup={handleAvatarPopupOpen}
                          onPlacePopup={handlePlacePopupOpen}
                          onCardClick={(card: CardData) =>
                            handleCardClick(card)
                          }
                          onCardLike={handleCardLike}
                          onCardDelete={handleCardDelete}
                          cards={cards}
                          currentUser={currentUser}
                          email={userEmail}
                          signOut={signOut}
                          element={Main}
                        />
                      }
                    />
                    {!loggedIn && (
                      <Route
                        path="/login"
                        element={
                          <Authorization authorization={authorization} />
                        }
                      />
                    )}
                    {!loggedIn && (
                      <Route
                        path="/registration"
                        element={
                          <Registration
                            loggedIn={loggedIn}
                            registration={registration}
                          />
                        }
                      />
                    )}

                    <Route path="*" element={<PageNotFound404 />} />
                  </Routes>
                  <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={handleClosePopup}
                    onUpdateUser={handleUpdateUser}
                  />
                  <EditAvattarPopup
                    isOpen={isAvatarPopupOpen}
                    onClose={handleClosePopup}
                    onEditAvatar={handleAvatarChange}
                  />
                  <AddPlacePopup
                    isOpen={isPlacePopupOpen}
                    onClose={handleClosePopup}
                    onAddCard={handleAddPlaceSubmit}
                  />
                  {loggedIn ? <Footer /> : ""}
                  <ImagePopup
                    closeByOverlay={closeByOverlay}
                    onClose={() => handleClosePopup()}
                    selectedCard={selectedCard}
                  />
                  <RequestPopup
                    isOpen={isRequestSucessPopupOpen}
                    closeByOverlay={closeByOverlay}
                    onClose={handleClosePopup}
                    title="Вы успешно зарегистрировались!"
                    image={imageSucess}
                  />
                  <RequestPopup
                    isOpen={isRequestBadPopupOpen}
                    closeByOverlay={closeByOverlay}
                    onClose={handleClosePopup}
                    title="Что-то пошло не так!
              Попробуйте ещё раз."
                    image={imageBad}
                  />
                </EmailContext.Provider>
              </AppContext.Provider>
            </CurrentUserCardsContext.Provider>
          </CurrentUserContext.Provider>
        </LoadingContext.Provider>
      )}
    </>
  );
};

export default App;
