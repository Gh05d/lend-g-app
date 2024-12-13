import React, {useCallback, useEffect, useState} from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  RefreshControl,
} from "react-native";
import {useTheme} from "@react-navigation/native";
import axios from "axios";

import type {CompositeScreenProps} from "@react-navigation/native";
import type {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import type {StackScreenProps} from "@react-navigation/stack";
import type {DrawerScreenProps} from "@react-navigation/drawer";

import ScreenWrapper from "../../../components/ScreenWrapper";
import AppText from "../../../components/AppText";

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
  const [refreshing, setRefreshing] = useState(false);

  const fetchItems = async () => {
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
  };

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await fetchItems();
    } finally {
      setRefreshing(false);
    }
  }

  const renderItem = useCallback(
    ({item}: {item: (typeof items)[0]}) => (
      <Pressable
        style={[styles.itemContainer, {backgroundColor: colors.card}]}
        onPress={() =>
          navigation.navigate("ItemDetails", {id: item.id, userID: item.userID})
        }
        accessibilityLabel={`Übersichtskarte von ${item.title}. Navigiert zur Übersichtsseite.`}>
        <AppText style={styles.itemTitle}>{item.title}</AppText>
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

  return (
    <ScreenWrapper loading={loading} error={error}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContainer, {gap: 16}]}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={{gap: 16}}
        numColumns={2}
        ListEmptyComponent={<AppText>Noch keine Angebote</AppText>}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
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
  itemPrice: {fontSize: 16},
});
