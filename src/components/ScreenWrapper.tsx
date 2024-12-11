import React, {useState} from "react";
import {StyleSheet, ViewStyle, RefreshControl, ScrollView} from "react-native";
import {useTheme} from "@react-navigation/native";

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  onRefresh?: () => Promise<void> | void;
}

const ScreenWrapper: React.FC<Props> = ({children, style, onRefresh}) => {
  const {colors} = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    console.log("FIRE");
    if (onRefresh) {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.wrapper,
        {backgroundColor: colors.background},
        style,
      ]}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        ) : undefined
      }>
      {children}
    </ScrollView>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({wrapper: {flexGrow: 1, padding: 24}});
