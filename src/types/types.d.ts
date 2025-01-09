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
  namespace globalThis {
    var server: any;
  }

  type AuthStackParamList = {
    Login: undefined;
    SignUp: undefined;
    NewWallet: undefined;
    CompleteSignUp: undefined;
    UseExistingWallet: undefined;
  };

  type HomeStackParamList = {
    Drawer: undefined;
    HomeScreen: undefined;
    ItemDetails: {id: string; userID: string};
    Confirmation: {
      itemID: string;
      userID: string;
      totalPrice: number;
      dateRange: string;
    };
  };

  type ManageItemsStackParamList = {
    ManageItems: {requestID?: string};
    Requests: {requestID: string};
  };

  type ChatStackParamList = {
    Chats: undefined;
    Chat: {chatID?: string; userName: string; profilePicture?: string};
  };

  type TabParamList = {
    HomeStack: {
      screen: keyof HomeStackParamList;
      params?: HomeStackParamList[keyof HomeStackParamList];
    };
    ManageItemsStack: {
      screen: keyof ManageItemsStackParamList;
      params?: ManageItemsStackParamList[keyof ManageItemsStackParamList];
    };
    QRCodes: undefined;
    ChatsStack: {
      screen: keyof ChatStackParamList;
      params?: ChatStackParamList[keyof ChatStackParamList];
    };
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

  interface PastRentals extends DateRangeType {
    userID: string;
  }

  type Item = {
    id: string;
    title: string;
    category: string;
    price: string;
    description: string;
    image: string;
    userID: string;
    pastRentals: PastRentals[];
    currentlyRentedBy: string;
  };

  type User = {
    id: string;
    firstName?: string;
    lastName?: string;
    gender?: string;
    email: string;
    phone?: string;
    userName: string;
    password: string;
    birthDate?: string;
    profilePicture?: string;
  };

  interface Request {
    id: string;
    ownerID: string;
    itemID: string;
    requesterID: string;
    price: string;
    timeFrame: DateRangeType;
    status: "open" | "accepted" | "denied" | "active" | "closed";
  }

  interface FullRequest extends Request {
    requester: User;
    item: Item;
  }

  interface Message {
    id: string;
    chatID: string;
    text: string;
    timestamp: Date;
    read?: Date | null;
    ownerID: string;
  }

  interface Chat {
    createdAt: string;
    id: string;
    ownerID: string;
    userID: string;
  }

  interface ChatPreview extends Chat {
    lastMessage: Message;
  }
}
