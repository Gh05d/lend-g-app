import React from "react";
import {useColorScheme} from "react-native";
import SplashScreen from "./components/Splash";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";
import {SafeAreaProvider} from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";

import Header from "./components/Header";
import HomeScreen from "./screens/tabs/HomeScreen";
import LoansScreen from "./screens/tabs/LoansScreen";
import ExploreScreen from "./screens/tabs/ExploreScreen";
import ChatScreen from "./screens/tabs/ChatScreen";
import ProfileScreen from "./screens/tabs/ProfileScreen";
import NotificationsScreen from "./screens/sidebar/NotificationsScreen";
import SettingsScreen from "./screens/sidebar/SettingsScreen";
import HelpScreen from "./screens/sidebar/HelpScreen";
import InviteScreen from "./screens/sidebar/InviteScreen";
import AboutScreen from "./screens/sidebar/AboutScreen";
import ItemDetailsScreen from "./screens/tabs/ItemDetailsScreen";
import {DrawerParamList, StackParamList, TabParamList} from "./types";

const Drawer = createDrawerNavigator<DrawerParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<StackParamList>();

const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#f6812c",
    background: "#FFFFFF",
    card: "#F8F8F8",
    text: "#212121",
    border: "#E0E0E0",
    notification: "#FF5722",
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#f6812c",
    background: "#121212",
    card: "#1E1E1E",
    text: "#FFFFFF",
    border: "#333333",
    notification: "#FF7043",
  },
};

const renderHeader = (title: string): JSX.Element => <Header title={title} />;

const getTabBarIcon = (
  routeName: string,
  color: string,
  size: number,
): JSX.Element => {
  let iconName;

  switch (routeName) {
    case "Home":
      iconName = "home";
      break;
    case "Loans":
      iconName = "money";
      break;
    case "Explore":
      iconName = "search";
      break;
    case "Chat":
      iconName = "comments";
      break;
    case "Profile":
      iconName = "user";
      break;
    default:
      iconName = "circle";
  }

  return <Icon name={iconName} size={size} color={color} />;
};

const HomeStack: React.FC = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} />
  </Stack.Navigator>
);

const BottomTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarIcon: ({color, size}) => getTabBarIcon(route.name, color, size),
    })}>
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Loans" component={LoansScreen} />
    <Tab.Screen name="Explore" component={ExploreScreen} />
    <Tab.Screen name="Chat" component={ChatScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const drawerScreens = [
  {name: "Tabs", component: BottomTabs, title: "Home"},
  {
    name: "Notifications",
    component: NotificationsScreen,
    title: "Notifications",
  },
  {name: "Settings", component: SettingsScreen, title: "Settings"},
  {name: "Help", component: HelpScreen, title: "Help"},
  {name: "Invite", component: InviteScreen, title: "Invite Friends"},
  {name: "About", component: AboutScreen, title: "About"},
];

const DrawerNavigator: React.FC = () => (
  <Drawer.Navigator>
    {drawerScreens.map(({name, component, title}) => (
      <Drawer.Screen
        key={name}
        name={name}
        component={component}
        options={{header: () => renderHeader(title)}}
      />
    ))}
  </Drawer.Navigator>
);

const App: React.FC = () => {
  const [initiated, setInitiated] = React.useState(false);
  const scheme = useColorScheme();

  if (!initiated) {
    return (
      <SplashScreen initiated removeSplashScreen={() => setInitiated(true)} />
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={scheme === "dark" ? CustomDarkTheme : CustomLightTheme}>
        <DrawerNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
