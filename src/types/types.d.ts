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
    Drawer: undefined;
    HomeScreen: undefined;
    ItemDetails: {id: string; userID: string};
  };

  type TabParamList = {
    Home: {
      screen: keyof StackParamList;
      params?: StackParamList[keyof StackParamList];
    };
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

  type DateRangeType = {
    startDate: DateType | null;
    endDate: DateType | null;
  };

  type Item = {
    id: string;
    title: string;
    category: string;
    price: string;
    description: string;
    image: string;
    userID: string;
    // rentedPeriods: {
    //   start: string;
    //   end: string;
    // }[];
    rentedPeriods: string;
  };

  type User = {
    id: string;
    firstName: string;
    lastName: string;
    maidenName: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    birthDate: string;
    image: string;
    bloodGroup: string;
    height: number;
    weight: number;
    eyeColor: string;
  };
}
