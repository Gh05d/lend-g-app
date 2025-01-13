import {createContext, Dispatch, SetStateAction} from "react";
import {createNavigationContainerRef} from "@react-navigation/native";
import {DimensionValue} from "react-native";

export const UserContext = createContext<{
  user: User | null;
  setUser: (user: User) => Dispatch<SetStateAction<User | null>> | void;
}>({user: null, setUser: () => {}});

export const navigationRef = createNavigationContainerRef();

export const THEME = "THEME";
export const WALLET_ADDRESS = "WALLET_ADDRESS";

export const authContainer = {
  gap: 24,
  paddingHorizontal: 24,
  borderRadius: 16,
  paddingVertical: 26,
};

export const basicModalStyles = {
  margin: "auto" as DimensionValue,
  padding: 24,
  justifyContent: "space-between" as "space-between",
  width: "80%" as DimensionValue,
  gap: 30,
  borderRadius: 16,
};

export const boxShadow = "2px 2px 4px rgba(0, 13, 13, 0.6)";

export const APP_IDENTITY = {
  name: "LendG dApp",
  uri: "https://lendg.de",
  icon: "https://github.com/favicon.ico", // Full path resolves to https://yourdapp.com/favicon.ico
};
