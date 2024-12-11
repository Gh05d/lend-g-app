import React from "react";
import {StyleSheet, View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";

import {StackParamList} from "../../types";
import ScreenWrapper from "../../components/ScreenWrapper";

type Props = StackScreenProps<StackParamList, "ItemDetails">;

const ItemDetailsScreen: React.FC<Props> = props => {
  return <ScreenWrapper></ScreenWrapper>;
};

export default ItemDetailsScreen;

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: "#fff"},
});
