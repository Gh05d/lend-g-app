import React from "react";
import {View, Text, Pressable, StyleSheet} from "react-native";
import {
  useNavigation,
  DrawerActions,
  NavigationProp,
  useTheme,
} from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import AppText from "./AppText";

type RootParamList = {
  Notifications: undefined;
};

const Header: React.FC<{title: string}> = ({title}) => {
  const navigation = useNavigation<NavigationProp<RootParamList>>();
  const {colors} = useTheme();

  return (
    <View style={[styles.header, {backgroundColor: colors.primary}]}>
      <Pressable
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <Icon name="bars" style={styles.icon} />
      </Pressable>
      <AppText bold style={styles.title}>
        {title}
      </AppText>
      <Pressable onPress={() => navigation.navigate("Notifications")}>
        <Icon name="bell" style={styles.icon} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  title: {fontSize: 18, color: "#fff"},
  icon: {fontSize: 24, color: "#fff"},
});

export default Header;
