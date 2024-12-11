import React, {useCallback} from "react";
import {FlatList, Pressable, StyleSheet, TextInput, View} from "react-native";
import {useTheme} from "@react-navigation/native";

import type {CompositeScreenProps} from "@react-navigation/native";
import type {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import type {StackScreenProps} from "@react-navigation/stack";
import type {DrawerScreenProps} from "@react-navigation/drawer";

import ScreenWrapper from "../../components/ScreenWrapper";
import AppText from "../../components/AppText";

import {StackParamList, TabParamList, DrawerParamList} from "../../types";

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Home">,
  CompositeScreenProps<
    StackScreenProps<StackParamList>,
    DrawerScreenProps<DrawerParamList>
  >
>;

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const {colors} = useTheme();

  const renderItem = useCallback(
    ({item}: {item: (typeof mockItems)[0]}) => (
      <Pressable
        style={[styles.itemContainer, {backgroundColor: colors.card}]}
        onPress={() => navigation.navigate("ItemDetails", {id: item.id})}>
        <AppText style={styles.itemTitle}>{item.title}</AppText>
        <AppText style={styles.itemCategory}>{item.category}</AppText>
        <AppText style={[styles.itemPrice, {color: colors.primary}]}>
          {item.price}
        </AppText>
      </Pressable>
    ),
    [colors.card, colors.primary],
  );

  const renderHeader = useCallback(
    () => (
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search items..." />
      </View>
    ),
    [],
  );

  return (
    <ScreenWrapper>
      <FlatList
        data={mockItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContainer, {gap: 16}]}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={{gap: 16}}
        numColumns={2}
      />
    </ScreenWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    marginBottom: 16,
  },
  searchInput: {
    fontSize: 16,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 1,
  },
  listContainer: {paddingHorizontal: 16},
  itemContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    gap: 12,
  },
  itemTitle: {fontSize: 18},
  itemCategory: {fontSize: 14, color: "#555"},
  itemPrice: {fontSize: 16},
});
