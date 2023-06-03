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
    const id = req.userId
    // const { id } = req.params
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
    const id = req.userId
    // const { id } = req.params
    const response = await User.findById(id)
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
      throw new ValidationError("Неправильные почта или пароль")
    }
    const { NODE_ENV, JWT_SECRET } = process.env

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
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError("Переданы некорректные данные"))
      return
    }
    next(err)
  }
}

const updateProfile = async (req, res, next, data) => {
  try {
    const id = req.userId
    const { name, about, avatar } = req.body
    const result = await User.findByIdAndUpdate(
      id,
      { name, about, avatar },
      { new: true, runValidators: true }
    )
    if (!result) {
      next(new NotFound("Пользователь с похожим ID не найден"))
      return
    }
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
  const { name, about } = req.body
  return updateProfile(req, res, next, { name, about })
}

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body
  return updateProfile(req, res, next, { avatar })
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
