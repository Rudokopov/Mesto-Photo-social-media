import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import { router } from "./routes/index.js"
import celebrate from "celebrate"
import { handleErrors } from "./middlewares/validate.js"
import { corsOptions } from "./middlewares/corsOptions.js"
import { PORT, DATA_BASE } from "./config.js"
import { requestLogger, errorLogger } from "./middlewares/logger.js"
dotenv.config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(
  "mongodb+srv://admin:bZmYHxSu89e3AmOG@cluster0.9knm9lc.mongodb.net/"
)

app.use(requestLogger)

app.use(cors(corsOptions))
app.use(router)

app.use(errorLogger)
app.use(celebrate.errors())
app.use(handleErrors)

app.listen(PORT, () => {
  console.log("Ссылка на сервер")
})
