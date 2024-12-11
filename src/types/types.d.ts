import {Theme} from "@react-navigation/native";

declare module "@react-navigation/native" {
  export type ExtendedTheme = Theme & {
    colors: Theme["colors"] & {
      error: string;
      secondary: string;
    };
  };

  export function useTheme(): ExtendedTheme;
}

declare global {
  type StackParamList = {
    HomeScreen: undefined;
    ItemDetails: {id: string; userID: string};
  };

  type TabParamList = {
    Home: undefined;
    Loans: undefined;
    Explore: undefined;
    Chat: undefined;
    Profile: undefined;
  };

  type DrawerParamList = {
    Tabs: undefined;
    Notifications: undefined;
    Settings: undefined;
    Help: undefined;
    Invite: undefined;
    About: undefined;
  };

  type Item = {
    id: string;
    title: string;
    category: string;
    price: string;
    description: string;
    image: string;
    userID: string;
    rentedPeriods: {
      start: string;
      end: string;
    }[];
  };
}
