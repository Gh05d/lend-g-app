import {createContext, Dispatch, SetStateAction} from "react";
import {createNavigationContainerRef} from "@react-navigation/native";

export const UserContext = createContext<{
  user: User | null;
  setUser: (user: User) => Dispatch<SetStateAction<User | null>> | void;
}>({user: null, setUser: () => {}});

export const THEME = "THEME";

export const navigationRef = createNavigationContainerRef();
