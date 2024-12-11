import {useTheme} from "@react-navigation/native";
import React from "react";
import {Platform, StyleProp, Text, TextProps, TextStyle} from "react-native";

interface Props extends TextProps {
  style?: StyleProp<TextStyle>;
  bold?: boolean;
  italic?: boolean;
  children: React.ReactNode;
  testID?: string;
}

const AppText: React.FC<Props> = ({
  children,
  style,
  bold,
  italic,
  testID,
  ...textProps
}) => {
  const {colors} = useTheme();

  const fontSize =
    Platform.OS === "ios" ? 16 : Platform.OS === "android" ? 14 : 20;

  const computedFontSize =
    style && typeof style === "object" && "fontSize" in style
      ? (style.fontSize as number)
      : fontSize;

  const lineHeight = Math.round(computedFontSize * 1.5);

  const textStyles: StyleProp<TextStyle> = {
    fontSize: computedFontSize,
    lineHeight,
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
