import React from "react";

export const CurrentUserContext = React.createContext();

export const currentUser = {
  userInfo: {
    name: "",
    about: "",
    avatar: {},
    _id: "",
  },
};
