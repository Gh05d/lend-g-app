import React from "react";
import {View, StyleSheet, ViewStyle, StyleProp} from "react-native";
import {useTheme} from "@react-navigation/native";
import Loading from "./Loading";
import Error from "./Error";

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  loading: boolean;
  error: Error | null;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  testID,
  style,
  loading,
  error,
}) => {
  const {colors} = useTheme();

  function renderView() {
    if (loading) return <Loading text="Lade Angebote" />;
    if (error) return <Error fullScreen error={error} />;
    return children;
  }

  return (
    <View
      testID={testID}
      style={[styles.wrapper, {backgroundColor: colors.background}, style]}>
      {renderView()}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({wrapper: {flex: 1, padding: 24}});
