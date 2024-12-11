import React, {useCallback, useEffect, useState} from "react";
import {FlatList, StyleSheet, Pressable} from "react-native";
import {useTheme} from "@react-navigation/native";
import axios from "axios";
import type {CompositeScreenProps} from "@react-navigation/native";
import type {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import type {StackScreenProps} from "@react-navigation/stack";

import ScreenWrapper from "../../components/ScreenWrapper";
import AppText from "../../components/AppText";

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Loans">,
  StackScreenProps<StackParamList>
>;

const LoansScreen: React.FC<Props> = ({navigation}) => {
  const {colors} = useTheme();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);

  useEffect(() => {
    (async function fetchLoans() {
      try {
        const {data} = await axios.get<Item[]>(
          "http://my-json-server.typicode.com/Gh05d/lend-g-app/items",
        );
        setItems(data.filter(item => item.userID === "1")); // Example user ID
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderItem = useCallback(
    ({item}: {item: Item}) => (
      <Pressable
        style={[styles.itemContainer, {backgroundColor: colors.card}]}
        onPress={() =>
          navigation.navigate("Home", {
            screen: "ItemDetails",
            params: {id: item.id, userID: item.userID},
          })
        }>
        <AppText bold style={styles.itemTitle}>
          {item.title}
        </AppText>
        <AppText style={[styles.itemPrice, {color: colors.primary}]}>
          {item.price}
        </AppText>
      </Pressable>
    ),
    [colors.card, colors.primary, navigation],
  );

  return (
    <ScreenWrapper loading={loading} error={error}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<AppText>Keine ausgeliehenen Gegenstände</AppText>}
      />
    </ScreenWrapper>
  );
};

export default LoansScreen;

const styles = StyleSheet.create({
  listContainer: {padding: 16},
  itemContainer: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 1,
  },
  itemTitle: {fontSize: 18, marginBottom: 8},
  itemPrice: {fontSize: 16},
});
