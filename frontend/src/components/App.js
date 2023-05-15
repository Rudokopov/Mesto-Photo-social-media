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

function App() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [loggedIn, setloggedIn] = useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAvatarPopupOpen, setAvatarPopupOpen] = useState(false);
  const [isPlacePopupOpen, setPlacePopupOpen] = useState(false);
  const [isRequestSucessPopupOpen, setRequestSucessPopupOpen] = useState(false);
  const [isRequestBadPopupOpen, setRequestBadPopupOpen] = useState(false);

  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    setLoading(true);
    tokenCheck();
  }, []);

  useEffect(() => {}, [isPlacePopupOpen]);

  const udpateCardsData = useCallback(async () => {
    await api.getInitialCards().then((data) => setCards(data));
  }, []);

  const closeByOverlay = (e) => {
    if (e.target.classList.contains("popup_opened")) {
      handleClosePopup();
    }
  };

  const requestUserData = () => {
    Promise.all([api.getProfileInfo(), api.getInitialCards()])
      .then(([userData, cards]) => {
        setCurrentUser(userData);
        setCards(cards);
        setUserEmail(userData.email);
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

  const registration = (email, password) => {
    auth
      .register(email, password)
      .then(() => {
        handleRequestSucessPopupOpen();
        navigate("/login", { replace: true });
      })
      .catch((err) => {
        console.log(err.message);
        handleRequestBadPopupOpen();
      });
  };

  const authorization = useCallback(async (email, password) => {
    try {
      await auth
        .authorize(email, password)
        .then((data) => {
          if (data.token) {
            localStorage.setItem("jwt", data.token);
            handleLogin();
            navigate("/", { replace: true });
            tokenCheck();
          }
          return;
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  const handleCardLike = (card) => {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    if (!isLiked) {
      api
        .likeCard(card)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
          udpateCardsData();
        })
        .catch((err) => console.log(err));
    } else {
      api
        .deleteLike(card)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
          udpateCardsData();
        })
        .catch((err) => console.log(err));
    }
  };

  const handleUpdateUser = ({ name, description }) => {
    api
      .changeProfileInfo({ name, description })
      .then((state) => {
        setCurrentUser(state);
        handleClosePopup();
      })
      .catch((err) => console.log(err));
  };

  const handleCardDelete = (id) => {
    api
      .deleteCard(id)
      .then(() => {
        setCards((prevCards) => prevCards.filter((card) => card._id !== id));
      })
      .catch((err) => console.log(err));
  };

  const handleAvatarChange = ({ imageAvatar }) => {
    api
      .setNewAvatar({ imageAvatar })
      .then((result) => {
        setCurrentUser(result);
        handleClosePopup();
      })
      .catch((err) => console.log(err));
  };

  const handleAddPlaceSubmit = useCallback(({ name, link }) => {
    api
      .addNewCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        udpateCardsData();
        handleClosePopup();
      })
      .catch((err) => console.log(err));
  }, []);

  const handleLogin = useCallback(() => {
    setloggedIn(true);
  }, []);

  const handleCardClick = useCallback((card) => {
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
    setSelectedCard({});
    setAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setPlacePopupOpen(false);
    setRequestBadPopupOpen(false);
    setRequestSucessPopupOpen(false);
  };

  return (
    <>
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
                        onCardClick={(card) => handleCardClick(card)}
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
                        <Authorization
                          handleLogin={handleLogin}
                          authorization={authorization}
                          loggedIn={loggedIn}
                          errorPopup={handleRequestBadPopupOpen}
                        />
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
                          errorPopup={handleRequestBadPopupOpen}
                          sucessPopup={handleRequestSucessPopupOpen}
                        />
                      }
                    />
                  )}

                  <Route path="*" element={<PageNotFound404 />} />
                </Routes>
                <EditProfilePopup
                  isOpen={isEditProfilePopupOpen}
                  onClose={handleClosePopup}
                  closeByOverlay={closeByOverlay}
                  onUpdateUser={handleUpdateUser}
                  currentUser={currentUser}
                />
                <EditAvattarPopup
                  isOpen={isAvatarPopupOpen}
                  closeByOverlay={closeByOverlay}
                  onClose={handleClosePopup}
                  onEditAvatar={handleAvatarChange}
                />
                <AddPlacePopup
                  isOpen={isPlacePopupOpen}
                  closeByOverlay={closeByOverlay}
                  onClose={handleClosePopup}
                  onAddCard={handleAddPlaceSubmit}
                />
                {loggedIn ? <Footer /> : ""}
                <ImagePopup
                  closeByOverlay={closeByOverlay}
                  onClose={() => handleClosePopup({})}
                  isOpen={selectedCard}
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
    </>
  );
}

export default App;
