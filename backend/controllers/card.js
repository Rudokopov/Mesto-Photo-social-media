import Card from "../models/card.js"
import mongoose from "mongoose"
import {
  NotFound,
  BadRequestError,
  AccessError,
} from "../customErrors/customErrors.js"

const getCards = async (req, res, next) => {
  try {
    const response = await Card.find({}).populate(["owner", "likes"])
    res.send(response)
  } catch (err) {
    next(err)
  }
}

const createCard = async (req, res, next) => {
  try {
    const id = req.userId
    const { name, link } = req.body
    const card = await Card.create({ name, link, owner: id })
    if (!card) {
      throw new NotFound("Ошибка при создании карточки")
    }
    const populatedCard = await card.populate("owner")
    res.send(populatedCard)
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError("Переданы некорректные данные"))
      return
    }
    next(err)
  }
}

const deleteCard = async (req, res, next) => {
  try {
    const userId = req.userId
    const { id } = req.params
    const card = await Card.findById(id).populate(["owner", "likes"])
    if (!card) {
      throw new NotFound("Карточка с таким ID не найдена")
    }
    if (card.owner.id !== userId) {
      throw new AccessError("У вас нет на это прав")
    }
    await Card.deleteOne(card)
    res.send(card)
  } catch (err) {
    next(err)
  }
}

const likeCard = async (req, res, next) => {
  try {
    const ownerId = req.userId
    const { id } = req.params
    const response = await Card.findByIdAndUpdate(
      id,
      { $addToSet: { likes: ownerId } },
      { new: true }
    )
    if (!response) {
      throw new NotFound("Карточка с похожим ID не найдена")
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

const dislakeCard = async (req, res, next) => {
  try {
    const ownerId = req.userId
    const { id } = req.params
    const response = await Card.findByIdAndUpdate(
      id,
      { $pull: { likes: ownerId } },
      { new: true }
    )
    if (!response) {
      throw new NotFound("Карточка с похожим ID не найдена")
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

export { getCards, createCard, deleteCard, likeCard, dislakeCard }
