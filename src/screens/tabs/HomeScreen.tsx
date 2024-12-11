import React, {useCallback, useEffect, useState} from "react";
import {FlatList, Pressable, StyleSheet, TextInput} from "react-native";
import {useTheme} from "@react-navigation/native";

import type {CompositeScreenProps} from "@react-navigation/native";
import type {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import type {StackScreenProps} from "@react-navigation/stack";
import type {DrawerScreenProps} from "@react-navigation/drawer";

import ScreenWrapper from "../../components/ScreenWrapper";
import AppText from "../../components/AppText";

import Loading from "../../components/Loading";
import Error from "../../components/Error";
import axios from "axios";

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Home">,
  CompositeScreenProps<
    StackScreenProps<StackParamList>,
    DrawerScreenProps<DrawerParamList>
  >
>;

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const {colors} = useTheme();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);

  useEffect(() => {
    (async function fetchItems() {
      try {
        const {data} = await axios<Item[]>(
          "http://my-json-server.typicode.com/Gh05d/lend-g-app/items",
        );

        setItems(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderItem = useCallback(
    ({item}: {item: (typeof items)[0]}) => (
      <Pressable
        style={[styles.itemContainer, {backgroundColor: colors.card}]}
        onPress={() =>
          navigation.navigate("ItemDetails", {id: item.id, userID: item.userID})
        }>
        <AppText style={styles.itemTitle}>{item.title}</AppText>
        <AppText style={styles.itemCategory}>{item.category}</AppText>
        <AppText style={[styles.itemPrice, {color: colors.primary}]}>
          {item.price}
        </AppText>
      </Pressable>
    ),
    [colors.card, navigation, colors.primary],
  );

  const renderHeader = useCallback(
    () => (
      <TextInput
        style={[
          styles.searchInput,
          {color: colors.text, backgroundColor: colors.card},
        ]}
        placeholder="Angebote durchsuchen..."
      />
    ),
    [colors.text, colors.card],
  );

  if (loading) return <Loading text="Lade Angebote" />;
  if (error) return <Error fullScreen error={error} />;

  return (
    <ScreenWrapper>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContainer, {gap: 16}]}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={{gap: 16}}
        numColumns={2}
        ListEmptyComponent={<AppText>Noch keine Angebote</AppText>}
      />
    </ScreenWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  searchInput: {
    marginBottom: 16,
    fontSize: 16,
    padding: 8,
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
