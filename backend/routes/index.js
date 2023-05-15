import express from "express"
import { NotFound } from "../customErrors/customErrors.js"
import { checkAuth } from "../middlewares/auth.js"

const router = express.Router()

// Импорт контроллеров для карточек
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislakeCard,
} from "../controllers/card.js"

// Импорт контроллеров для юзера
import {
  getUser,
  createUser,
  login,
  getUserById,
  getUserMe,
  updateUser,
  updateAvatar,
} from "../controllers/user.js"

// Импорт контроллера ошибок
import {
  validateRegister,
  validateLogin,
  validateCreateCard,
  validateId,
  validateCardId,
  validateProfile,
  validateAvatar,
} from "../middlewares/handleErrors.js"

// Роуты для карточек
router.get("/cards", checkAuth, getCards)
router.post("/cards", checkAuth, validateCreateCard, createCard)
router.delete("/cards/:id", checkAuth, validateCardId, deleteCard)
router.put("/cards/:id/likes", checkAuth, validateCardId, likeCard)
router.delete("/cards/:id/likes", checkAuth, validateCardId, dislakeCard)

// Роуты юзера
router.get("/users/me", checkAuth, getUserMe)
router.get("/users", checkAuth, getUser)
router.get("/users/:id", checkAuth, validateId, getUserById)
router.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт")
  }, 0)
})
router.post("/signup", validateRegister, createUser)
router.post("/signin", validateLogin, login)
router.patch("/users/me", checkAuth, validateProfile, updateUser)
router.patch("/users/me/avatar", checkAuth, validateAvatar, updateAvatar)

router.all("*", (req, res, next) => {
  next(new NotFound("Такого адреса не существует"))
})

export { router }
