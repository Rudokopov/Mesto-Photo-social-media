import React, { createContext } from "react";
import { DataUser } from "../components/App";

export const CurrentUserContext = createContext<DataUser | undefined>({
  name: "",
  about: "",
  email: "",
  avatar: "",
  _id: "",
});
