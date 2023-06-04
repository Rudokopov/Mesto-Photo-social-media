// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  "https://rudokopov.github.io/Mesto-Photo-social-media",
  "https://mesto-photo-social-media.vercel.app/login",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
]
const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE"
export const corsOptions = {
  origin: allowedCors, // Массив доменов, с которых разрешены кросс-доменные запросы
  methods: DEFAULT_ALLOWED_METHODS, // Разрешенные HTTP-методы
  credentials: true, // Разрешить отправку куки и заголовка авторизации
  optionsSuccessStatus: 200, // Установить статус успешного ответа для метода OPTIONS
  allowedHeaders: "*", // Разрешить все заголовки в запросе
}
