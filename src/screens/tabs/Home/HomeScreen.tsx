import React, {useCallback, useEffect, useState} from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  RefreshControl,
  Image,
  View,
} from "react-native";
import {useTheme} from "@react-navigation/native";
import axios from "axios";
import type {CompositeScreenProps} from "@react-navigation/native";
import type {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import type {StackScreenProps} from "@react-navigation/stack";

import ScreenWrapper from "../../../components/ScreenWrapper";
import AppText from "../../../components/AppText";

type Props = CompositeScreenProps<
  StackScreenProps<HomeStackParamList, "HomeScreen">,
  BottomTabScreenProps<TabParamList, "HomeStack">
>;

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const {colors} = useTheme();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchItems = async () => {
    try {
      const {data} = await axios.get<{items: Item[]}>("/api/items");

      setItems(data.items);
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
        style={[
          styles.itemContainer,
          {
            backgroundColor: item.currentlyRentedBy ? "#ccc" : colors.card,
            filter: item.currentlyRentedBy
              ? [{grayscale: 0.6, saturate: 0.5}]
              : [],
          },
        ]}
        onPress={() =>
          navigation.navigate("ItemDetails", {id: item.id, userID: item.userID})
        }
        accessibilityLabel={`Übersichtskarte von ${item.title}. Navigiert zur Übersichtsseite.`}>
        <AppText textSize="large" bold>
          {item.title}
        </AppText>

        <Image
          source={{uri: item.image}}
          style={styles.itemImage}
          resizeMode="cover"
        />
        <View
          style={[styles.tagContainer, {backgroundColor: colors.notification}]}>
          <AppText textSize="small">{item.category}</AppText>
        </View>
        <AppText style={[{color: colors.primary}]}>
          {item.price.substring(1)} €
        </AppText>
        <AppText>
          {!item.currentlyRentedBy ? "Verfügbar" : "Nicht verfügbar"}
        </AppText>
      </Pressable>
    ),
    [colors.card, colors.primary],
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
  itemImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
  },
  tagContainer: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
});
