import {DarkTheme, DefaultTheme} from "@react-navigation/native";

export const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#f6812c",
    background: "#FFFFFF",
    card: "#F8F8F8",
    text: "#212121",
    border: "#E0E0E0",
    notification: "#FF5722",
    error: "#D32F2F",
    secondary: "#1976D2",
  },
};

export const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#f6812c",
    background: "#121212",
    card: "#4E4E4E",
    text: "#FFFFFF",
    border: "#333333",
    notification: "#FF7043",
    error: "#EF5350",
    secondary: "#42A5F5",
  },
};
