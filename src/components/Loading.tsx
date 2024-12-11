import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import {useTheme} from "@react-navigation/native";

import AppText from "./AppText";

interface Props {
  text?: string;
  inline?: boolean;
  size?: "small" | "large";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

const Loading: React.FC<Props> = ({
  text = "Loading",
  style,
  textStyle,
  testID,
  size = "large",
  ...rest
}) => {
  const {colors} = useTheme();

  return (
    <View style={[styles.container, style]} testID={testID}>
      <AppText style={[{color: colors.primary}, textStyle]}>{text}...</AppText>
      <ActivityIndicator color={colors.primary} size={size} {...rest} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
