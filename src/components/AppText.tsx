import {useTheme} from "@react-navigation/native";
import React from "react";
import {Platform, StyleProp, Text, TextProps, TextStyle} from "react-native";

interface Props extends TextProps {
  style?: StyleProp<TextStyle>;
  bold?: boolean;
  italic?: boolean;
  textSize?: "small" | "regular" | "large" | "heading";
  children: React.ReactNode;
  testID?: string;
}

const AppText: React.FC<Props> = ({
  children,
  style,
  bold,
  italic,
  textSize = "regular",
  testID,
  ...textProps
}) => {
  const {colors} = useTheme();

  const baseFontSize =
    Platform.OS === "ios" ? 16 : Platform.OS === "android" ? 14 : 20;

  const fontSize = (() => {
    switch (textSize) {
      case "small":
        return baseFontSize * 0.85;
      case "large":
        return baseFontSize * 1.2;
      case "heading":
        return baseFontSize * 1.5;
      case "regular":
      default:
        return baseFontSize;
    }
  })();

  const textStyles: StyleProp<TextStyle> = {
    fontSize,
    lineHeight: fontSize + (fontSize * fontSize > 20 ? 1.5 : 1),
    fontWeight: bold ? "bold" : "normal",
    fontStyle: italic ? "italic" : "normal",
    fontFamily: "Roboto-Medium",
    color: colors.text,
  };

  return (
    <Text testID={testID} selectable {...textProps} style={[textStyles, style]}>
      {children}
    </Text>
  );
};

export default AppText;
