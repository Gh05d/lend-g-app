import React from "react";
import {View, StyleSheet, ViewStyle} from "react-native";
import {useTheme} from "@react-navigation/native";

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({children, style}) => {
  const {colors} = useTheme();

  return (
    <View style={[styles.wrapper, {backgroundColor: colors.background}, style]}>
      {children}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 24,
  },
});
