import React from "react";
import {Pressable, PressableProps, StyleSheet, ViewStyle} from "react-native";
import {useTheme} from "@react-navigation/native";

import AppText from "./AppText";

interface Props extends PressableProps {
  title: string;
  color?: string;
}

const AppButton: React.FC<Props> = props => {
  const {title, color, style, disabled, ...buttonProps} = props;
  const {colors} = useTheme();

  return (
    <Pressable
      style={({pressed}) => {
        const baseStyle: ViewStyle = {
          ...styles.button,
          backgroundColor: disabled ? "#B0B0B0" : color || colors.primary,
        };

        if (pressed && !disabled) return [baseStyle, style, styles.pressed];
        if (disabled) return [baseStyle, style, styles.disabled];

        return [baseStyle, style];
      }}
      disabled={disabled}
      {...buttonProps}>
      <AppText bold style={[styles.text, {color: disabled ? "#555" : "#FFF"}]}>
        {title}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {opacity: 0.6},
  pressed: {opacity: 0.8},
  text: {fontSize: 16},
});

export default AppButton;
