import React from "react";
import {Image} from "react-native";
import {RouteProp, useTheme} from "@react-navigation/native";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome";

import HomeScreen from "../screens/tabs/Home/HomeScreen";
import ManageItemsScreen from "../screens/tabs/ManageItems/ManageItemsScreen";
import ExploreScreen from "../screens/tabs/ExploreScreen";
import ChatsScreen from "../screens/tabs/Chat/ChatsScreen";
import ProfileScreen from "../screens/tabs/ProfileScreen";
import NotificationsScreen from "../screens/sidebar/NotificationsScreen";
import SettingsScreen from "../screens/sidebar/SettingsScreen";
import HelpScreen from "../screens/sidebar/HelpScreen";
import InviteScreen from "../screens/sidebar/InviteScreen";
import AboutScreen from "../screens/sidebar/AboutScreen";
import ItemDetailsScreen from "../screens/tabs/Home/ItemDetailsScreen";
import ConfirmationScreen from "../screens/tabs/Home/ConfirmationScreen";
import RequestsScreen from "../screens/tabs/ManageItems/RequestScreen";
import ChatScreen from "../screens/tabs/Chat/ChatScreen";

import Header from "../components/Header";

const renderHeader = (title: string): JSX.Element => <Header title={title} />;
const renderUserPicture = (route: RouteProp<ChatStackParamList, "Chat">) => (
  <Image
    source={{uri: route.params?.profilePicture}}
    style={{width: 40, height: 40, borderRadius: 20, marginRight: 10}}
  />
);

const Drawer = createDrawerNavigator<DrawerParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const ManageItemsStack = createStackNavigator<ManageItemsStackParamList>();
const ChatStack = createStackNavigator<ChatStackParamList>();

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
          title: "Anfragebestätigung",
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
        name="ManageItems"
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

const ChatStackNavigator: React.FC = () => {
  const {colors} = useTheme();

  return (
    <ChatStack.Navigator screenOptions={{headerShown: true}}>
      <ChatStack.Screen
        name="Chats"
        component={ChatsScreen}
        options={{headerShown: false}}
      />
      <ChatStack.Screen
        name="Chat"
        component={ChatScreen}
        options={({route}) => ({
          title: `Chat mit ${route.params?.userName || "Nutzer"}`,
          headerStyle: {backgroundColor: colors.background},
          headerRight: () => renderUserPicture(route),
        })}
      />
    </ChatStack.Navigator>
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
  {name: "HomeStack", component: HomeStackNavigator, options: {title: "Home"}},
  {
    name: "ManageItemsStack",
    component: ManageItemsStackNavigator,
    options: {title: "Leihübersicht"},
  },
  {name: "Explore", component: ExploreScreen, options: {title: "Entdecken"}},
  {
    name: "ChatsStack",
    component: ChatStackNavigator,
    options: {title: "Chats"},
  },
  {name: "Profile", component: ProfileScreen, options: {title: "Profil"}},
];

const getTabBarIcon = (
  routeName: string,
  color: string,
  size: number,
): JSX.Element => {
  let iconName;

  switch (routeName) {
    case "HomeStack":
      iconName = "home";
      break;
    case "ManageItemsStack":
      iconName = "money";
      break;
    case "Explore":
      iconName = "search";
      break;
    case "ChatsStack":
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

export default RootNavigator;
