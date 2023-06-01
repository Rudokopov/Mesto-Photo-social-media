import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: "Исследователь",
  },
  avatar: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?#?([\w.-]*)*$/i.test(
          v
        )
      },
      message: (props) => `${props.value} не является допустимой ссылкой!`,
    },
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v)
      },
      message: (props) =>
        `${props.value} не является допустимым email адресом!`,
    },
  },
  passwordHash: {
    type: "String",
    required: true,
    select: false,
  },
})

export default mongoose.model("user", userSchema)
