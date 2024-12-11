import React from "react";
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import {useTheme} from "@react-navigation/native";

import AppText from "./AppText";
import ScreenWrapper from "./ScreenWrapper";

interface Props {
  error?: Error | null;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode | string;
  fullScreen?: boolean;
}

const Error: React.FC<Props> = ({error, children, style, fullScreen}) => {
  const {colors} = useTheme();
  const Wrapper = fullScreen ? ScreenWrapper : View;

  if (!error) return null;
  console.info("🤕🤖 ~ Error: ", error);

  return (
    <Wrapper style={styles.container}>
      <AppText
        style={[{color: colors.error, padding: fullScreen ? 16 : 0}, style]}>
        {children || error.message}
      </AppText>
    </Wrapper>
  );
};

const styles = StyleSheet.create({container: {padding: 16}});

export default Error;
