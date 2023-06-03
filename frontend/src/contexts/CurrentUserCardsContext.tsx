import React from "react";
import { CardData } from "../components/App";

export const CurrentUserCardsContext = React.createContext<
  CardData[] | undefined
>(undefined);
