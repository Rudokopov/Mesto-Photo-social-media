import User from "../models/user.js"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import {
  NotFound,
  BadRequestError,
  UniqueError,
  ReferenceError,
} from "../customErrors/customErrors.js"

const searchUser = async (req) => {
  const id = req.userId
  const result = await User.findById(id)
  if (!result) {
    return false
  }
  return result
}

const getUser = async (req, res, next) => {
  try {
    const response = await User.find({})
    res.send(response)
  } catch (err) {
    next(err)
  }
}

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const response = await User.findById(id)
    if (!response) {
      throw new NotFound("Пользователь с похожим id не найден")
    }
    res.send(response)
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError("Переданы некорректные данные"))
      return
    }
    next(err)
  }
}

const getUserMe = async (req, res, next) => {
  try {
    const response = await searchUser(req)
    if (!response) {
      throw new NotFound("Пользователь с похожим id не найден")
    }
    res.send(response)
  } catch (err) {
    next(err)
  }
}

const createUser = async (req, res, next) => {
  try {
    const { name, about, avatar, email, password } = req.body
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const response = await User.create({
      name,
      about,
      avatar,
      email,
      passwordHash: hash,
    })
    const result = response.toObject()
    delete result.passwordHash

    res.send(201, { data: result })
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError("Переданы некорректные данные"))
      return
    }
    if (err.code === 11000) {
      next(new UniqueError("Такой email уже зарегестрирован"))
      return
    }
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select("+passwordHash")
    if (!user) {
      throw new ReferenceError("Пользователь не найден")
    }
    const isValid = await bcrypt.compare(password, user._doc.passwordHash)
    if (!isValid) {
      throw new AccessError("Неправильные почта или пароль")
    }
    const { NODE_ENV, JWT_SECRET } = process.env
    if (NODE_ENV !== "production") {
      const NODE_ENV = "production"
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      NODE_ENV === "production" ? JWT_SECRET : "secret-key-word",
      {
        expiresIn: "7d",
      }
    )
    const { passwordHash, ...userData } = user._doc
    // res.setHeader("Authorization", `Bearer ${token}`)
    res.send({
      ...userData,
      token,
    })
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError("Переданы некорректные данные"))
      return
    }
    next(err)
  }
}

// Не понимаю куда и для чего этот аппендекс в виде data нужен, типа в контроллере понятно, как контекст для остальных аргументов
// А тут куда ее вставлять? Пробовал распарсить {name, about, avatar} = data, но у меня прилетает undefined, только с req могу
// С кешем совсем запутался, мне же тут не надо кешировать запрос, верно?

// И по поводу объеденения логики поиска юзера в отдельной функции, пришлось усложнить конструкцию этой функции
// Поскольку после обновления данных, приходится искать снова юзера и уже после этого выводить обновленные данные
// Но возможно это я криво реализовал и можно было все сделать проще, очень жду вашего фидбека :)
const updateProfile = async (req, res, next, data) => {
  try {
    const { name, about, avatar } = req.body
    const user = await searchUser(req)
    if (!user) {
      next(new NotFound("Пользователь с похожим ID не найден"))
      return
    }
    await User.updateOne(
      user,
      { name, about, avatar },
      { new: true, runValidators: true }
    )
    const result = await searchUser(req)
    res.send(result)
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError("Переданы некорректные данные"))
      return
    }
    next(err)
  }
}

const updateUser = (req, res, next) => {
  const data = req.body
  return updateProfile.call(data, req, res, next)
}

const updateAvatar = (req, res, next) => {
  const data = req.body
  return updateProfile.call(data, req, res, next)
}

export {
  getUser,
  getUserById,
  getUserMe,
  createUser,
  login,
  updateUser,
  updateAvatar,
}
