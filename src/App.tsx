import React, {useEffect, useState} from "react";
import {useColorScheme} from "react-native";
import SplashScreen from "./components/Splash";
import {NavigationContainer, useTheme} from "@react-navigation/native";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";
import {SafeAreaProvider} from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";

import HomeScreen from "./screens/tabs/Home/HomeScreen";
import ManageItemsScreen from "./screens/tabs/ManageItems/ManageItemsScreen";
import ExploreScreen from "./screens/tabs/ExploreScreen";
import ChatScreen from "./screens/tabs/ChatScreen";
import ProfileScreen from "./screens/tabs/ProfileScreen";
import NotificationsScreen from "./screens/sidebar/NotificationsScreen";
import SettingsScreen from "./screens/sidebar/SettingsScreen";
import HelpScreen from "./screens/sidebar/HelpScreen";
import InviteScreen from "./screens/sidebar/InviteScreen";
import AboutScreen from "./screens/sidebar/AboutScreen";
import ItemDetailsScreen from "./screens/tabs/Home/ItemDetailsScreen";
import ConfirmationScreen from "./screens/tabs/Home/ConfirmationScreen";
import RequestsScreen from "./screens/tabs/ManageItems/RequestScreen";

import Header from "./components/Header";
import {CustomDarkTheme, CustomLightTheme} from "./themes";
import {UserContext} from "./common/variables";

const Drawer = createDrawerNavigator<DrawerParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const ManageItemsStack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator: React.FC = () => {
  const {colors} = useTheme();

  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen
        name="ItemDetails"
        component={ItemDetailsScreen}
        options={{
          title: "Artikelbeschreibung",
          headerShown: true,
          headerStyle: {backgroundColor: colors.background},
        }}
      />
      <HomeStack.Screen
        name="Confirmation"
        component={ConfirmationScreen}
        options={{
          title: "Buchungsbestätigung",
          headerShown: true,
          headerStyle: {backgroundColor: colors.background},
        }}
      />
    </HomeStack.Navigator>
  );
};

const ManageItemsStackNavigator: React.FC = () => {
  const {colors} = useTheme();

  return (
    <ManageItemsStack.Navigator screenOptions={{headerShown: true}}>
      <ManageItemsStack.Screen
        name="ManageItemsScreen"
        component={ManageItemsScreen}
        options={{headerShown: false}}
      />
      <ManageItemsStack.Screen
        name="Requests"
        component={RequestsScreen}
        options={{
          title: "Anfragen",
          headerStyle: {backgroundColor: colors.background},
        }}
      />
    </ManageItemsStack.Navigator>
  );
};

const drawerScreens: Array<{
  name: keyof DrawerParamList;
  component: React.ComponentType<any>;
  title: string;
}> = [
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

const tabScreens: Array<{
  name: keyof TabParamList;
  component: React.ComponentType<any>;
  options: {title: string};
}> = [
  {name: "Home", component: HomeStackNavigator, options: {title: "Home"}},
  {
    name: "ManageItems",
    component: ManageItemsStackNavigator,
    options: {title: "Leihübersicht"},
  },
  {name: "Explore", component: ExploreScreen, options: {title: "Entdecken"}},
  {name: "Chat", component: ChatScreen, options: {title: "Chat"}},
  {name: "Profile", component: ProfileScreen, options: {title: "Profil"}},
];

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
    case "ManageItems":
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

const BottomTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      header: ({options}) => renderHeader(options.title || route.name),
      tabBarIcon: ({color, size}) => getTabBarIcon(route.name, color, size),
    })}>
    {tabScreens.map(screen => (
      <Tab.Screen key={screen.name} {...screen} />
    ))}
  </Tab.Navigator>
);

const DrawerNavigator: React.FC = () => (
  <Drawer.Navigator>
    <Drawer.Screen
      name="Tabs"
      component={BottomTabs}
      options={{headerShown: false}}
    />
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

const RootNavigator: React.FC = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Drawer"
      component={DrawerNavigator}
      options={{headerShown: false}}
    />
  </HomeStack.Navigator>
);

const App: React.FC = () => {
  const [initiated, setInitiated] = React.useState(false);
  const [show, toggle] = React.useState(true);

  const [user, setUser] = useState(null);

  const scheme = useColorScheme();

  useEffect(() => {
    (async function fetchUser() {
      try {
        const {data} = await axios.get("https://dummyjson.com/users/1");
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setInitiated(true);
      }
    })();
  }, []);

  if (show) {
    return (
      <SplashScreen
        initiated={initiated}
        removeSplashScreen={() => toggle(false)}
      />
    );
  }

  return (
    <UserContext.Provider value={user}>
      <SafeAreaProvider>
        <NavigationContainer
          theme={scheme === "dark" ? CustomDarkTheme : CustomLightTheme}>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </UserContext.Provider>
  );
};

export default App;
