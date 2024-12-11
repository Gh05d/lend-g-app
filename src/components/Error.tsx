import React from "react";
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import {useTheme} from "@react-navigation/native";

import AppText from "./AppText";

interface Props {
  error?: Error | null;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode | string;
  fullScreen?: boolean;
}

const Error: React.FC<Props> = ({error, children, style, fullScreen}) => {
  const {colors} = useTheme();

  if (!error) return null;
  console.info("🤕🤖 ~ Error: ", error);

  return (
    <View style={styles.container}>
      <AppText
        style={[{color: colors.error, padding: fullScreen ? 16 : 0}, style]}>
        {children || error.message}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({container: {padding: 16}});

export default Error;
