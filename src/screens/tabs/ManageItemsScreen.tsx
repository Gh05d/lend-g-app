import React, {useCallback, useContext, useEffect, useState} from "react";
import {SectionList, StyleSheet, View, RefreshControl} from "react-native";
import {useTheme} from "@react-navigation/native";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import axios from "axios";

import AppText from "../../components/AppText";
import AppButton from "../../components/AppButton";
import ScreenWrapper from "../../components/ScreenWrapper";
import {UserContext} from "../../common/variables";

type Props = BottomTabScreenProps<TabParamList, "ManageItems">;

const ManageItemsScreen: React.FC<Props> = ({navigation}) => {
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [itemsLent, setItemsLent] = useState<Item[]>([]);
  const [itemsBorrowed, setItemsBorrowed] = useState<Item[]>([]);
  const [rentalHistory, setRentalHistory] = useState<Item[]>([]);
  const [userNames, setUserNames] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const {colors} = useTheme();
  const currentUser = useContext(UserContext);
  const userID = currentUser!.id;

  async function fetchData() {
    try {
      const itemsResponse = await axios.get<Item[]>(
        "http://my-json-server.typicode.com/Gh05d/lend-g-app/items",
      );

      const requestsResponse = await axios.get<Request[]>(
        "http://my-json-server.typicode.com/Gh05d/lend-g-app/requests",
      );

      const userRequests = await Promise.all(
        requestsResponse.data.map(request =>
          axios.get<User>(`https://dummyjson.com/users/${request.userID}`),
        ),
      );

      const usersMap = userRequests.reduce((map, response) => {
        const user = response.data;
        map[user.id] = user.username;
        return map;
      }, {} as {[key: string]: string});

      setUserNames(usersMap);

      setItemsLent(
        itemsResponse.data.filter(
          item => item.userID === userID && item.currentlyRented,
        ),
      );

      setPendingRequests(
        requestsResponse.data.filter(request => request.userID === userID),
      );

      setItemsBorrowed(
        itemsResponse.data.filter(item => item.borrowedBy === userID),
      );

      setRentalHistory(
        itemsResponse.data.filter(
          item =>
            (item.userID === userID || item.borrowedBy === userID) &&
            item.isHistory,
        ),
      );
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleViewRequests = (itemID: string) => {
    navigation.navigate("Requests", {itemID});
  };

  const renderItem = useCallback(
    ({item}: {item: Item}) => (
      <View style={[styles.itemContainer, {backgroundColor: colors.card}]}>
        <AppText bold>{item.title}</AppText>
        <AppText>Preis: {item.price} €</AppText>
        {item.rentedPeriods && (
          <AppText>Verliehen: {item.rentedPeriods}</AppText>
        )}
        <AppButton
          style={{marginTop: 12}}
          title="Anfragen anzeigen"
          onPress={() => handleViewRequests(item.id)}
        />
      </View>
    ),
    [colors.card, colors.primary],
  );

  const sections = [
    {
      title: "Offene Anfragen",
      data: pendingRequests.map(request => ({
        id: request.itemID,
        title:
          `Nutzer ${userNames[request.userID]} fragt Miete an.` ||
          "Unbekannter Benutzer",
        price: request.price,
        rentedPeriods: `${request.timeFrame.startDate} - ${request.timeFrame.endDate}`,
      })),
      renderItem,
      emptyText: "Keine offenen Anfragen",
    },
    {
      title: "Verliehene Artikel",
      data: itemsLent,
      renderItem,
      emptyText: "Keine verliehenen Artikel",
    },
    {
      title: "Geliehene Artikel",
      data: itemsBorrowed,
      renderItem,
      emptyText: "Keine geliehenen Artikel",
    },
    {
      title: "Vergangene Transaktionen",
      data: rentalHistory,
      renderItem,
      emptyText: "Keine vergangenen Transaktionen",
    },
  ];

  return (
    <ScreenWrapper loading={loading} error={error}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({item, section}) => section.renderItem({item})}
        renderSectionHeader={({section}) => (
          <AppText style={styles.sectionTitle}>{section.title}</AppText>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {fontSize: 20, marginVertical: 12},
  itemContainer: {padding: 16, gap: 12, marginBottom: 24, borderRadius: 8},
});

export default ManageItemsScreen;
