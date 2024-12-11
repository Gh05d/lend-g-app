import React from "react";
import {StyleSheet} from "react-native";
import {useTheme} from "@react-navigation/native";
import type {NativeStackScreenProps} from "@react-navigation/native-stack";

import ScreenWrapper from "../../components/ScreenWrapper";
import AppText from "../../components/AppText";

import {StackParamList} from "../../types";
import {mockItems} from "../../mock-api";

type Props = NativeStackScreenProps<StackParamList, "ItemDetails">;

const ItemDetailsScreen: React.FC<Props> = ({route}) => {
  const {id} = route.params;
  const item = mockItems.find(value => value.id === id);

  const {colors} = useTheme();

  if (!item) {
    return (
      <ScreenWrapper>
        <AppText style={[styles.errorText, {color: colors.notification}]}>
          Item not found.
        </AppText>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppText bold style={styles.title}>
        {item.title}
      </AppText>
      <AppText style={styles.category}>{item.category}</AppText>
      <AppText bold style={[styles.price, {color: colors.primary}]}>
        {item.price}
      </AppText>
      <AppText style={styles.description}>
        Description: {item.description || "No description available."}
      </AppText>
    </ScreenWrapper>
  );
};

export default ItemDetailsScreen;

const styles = StyleSheet.create({
  title: {fontSize: 24, marginBottom: 8},
  category: {fontSize: 18, marginBottom: 8},
  price: {fontSize: 20, marginBottom: 16},
  description: {fontSize: 16},
  errorText: {fontSize: 18, textAlign: "center"},
});
