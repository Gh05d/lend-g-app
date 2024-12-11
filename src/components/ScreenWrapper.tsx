import React from "react";
import {View, StyleSheet, ViewStyle, StyleProp} from "react-native";
import {useTheme} from "@react-navigation/native";

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  testID,
  style,
}) => {
  const {colors} = useTheme();

  return (
    <View
      testID={testID}
      style={[styles.wrapper, {backgroundColor: colors.background}, style]}>
      {children}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  wrapper: {flex: 1, padding: 24},
});
