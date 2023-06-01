// middlewares/logger.js

// импортируем нужные модули
import winston from "winston"
import expressWinston from "express-winston"

// Создадим logger запросов
const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: "request.log" })],
  format: winston.format.json(),
})

// логгер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: "error.log" })],
  format: winston.format.json(),
  meta: true, // включите метаданные запроса, включая тело запроса
  msg: "HTTP {{req.method}} {{req.url}}",
})

export { requestLogger, errorLogger }
