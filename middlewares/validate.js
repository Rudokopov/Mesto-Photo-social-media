import { Joi, celebrate } from "celebrate"

const checkLink =
  /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/

const handleErrors = (err, req, res, next) => {
  const { statusCode = 500 } = err
  let { message } = err

  if (statusCode === 500) {
    message = "Внутренняя ошибка сервера"
  }

  res.send(statusCode, { message })
}

const validateRegister = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),

    avatar: Joi.string().pattern(checkLink),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
})

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
})

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(checkLink),
  }),
})

const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
})

const validateCardId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
})

const validateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
})

const validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(checkLink),
  }),
})

export {
  handleErrors,
  validateRegister,
  validateLogin,
  validateCreateCard,
  validateId,
  validateCardId,
  validateProfile,
  validateAvatar,
}
