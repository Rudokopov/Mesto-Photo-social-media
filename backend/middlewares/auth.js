import jwt from "jsonwebtoken"
import { ReferenceError } from "../customErrors/customErrors.js"

const checkAuth = async (req, res, next) => {
  const t = req.headers.authorization
  if (!t) {
    return next(new ReferenceError("У вас нет доступа"))
  }
  const token = t.replace(/Bearer\s/, "")
  try {
    const decoded = jwt.verify(token, "secret-key-word")
    req.userId = decoded._id
    next()
  } catch (err) {
    next(new ReferenceError("У вас нет доступа"))
    return
  }
}

export { checkAuth }
