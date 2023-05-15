// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  "http://mesto-rudokopov.nomoredomains.monster",
  "https://mesto-rudokopov.nomoredomains.monster",
  "http://localhost:3000",
  "localhost:3000",
  "http://localhost:3002",
  "localhost:3002",
]
const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE"
export const corsOptions = {
  origin: allowedCors, // Массив доменов, с которых разрешены кросс-доменные запросы
  methods: DEFAULT_ALLOWED_METHODS, // Разрешенные HTTP-методы
  credentials: true, // Разрешить отправку куки и заголовка авторизации
  optionsSuccessStatus: 200, // Установить статус успешного ответа для метода OPTIONS
  allowedHeaders: "*", // Разрешить все заголовки в запросе
}

// eslint-disable-next-line consistent-return
// export const checkCORS = (req, res, next) => {
//   const { method } = req
//   const { origin } = req.headers
//   const requestHeaders = req.headers["access-control-request-headers"]
//   res.header("Access-Control-Allow-Credentials", true)
//   if (allowedCors.includes(origin)) {
//     res.header("Access-Control-Allow-Origin", origin)
//   }
//   if (method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS)
//     res.header("Access-Control-Allow-Headers", requestHeaders)
//     return res.end()
//   }
//   next()
// }
