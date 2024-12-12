import React, {useEffect, useState} from "react";
import {SectionList, StyleSheet, View} from "react-native";
import {useTheme} from "@react-navigation/native";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import axios from "axios";

import AppText from "../../components/AppText";
import AppButton from "../../components/AppButton";
import ScreenWrapper from "../../components/ScreenWrapper";

type Props = BottomTabScreenProps<TabParamList, "ManageItems">;

const userID = "1"; // Replace with actual user ID from context or props

const ManageItemsScreen: React.FC<Props> = ({navigation}) => {
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [itemsLent, setItemsLent] = useState<Item[]>([]);
  const [itemsBorrowed, setItemsBorrowed] = useState<Item[]>([]);
  const [rentalHistory, setRentalHistory] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const {colors} = useTheme();

  useEffect(() => {
    (async function fetchData() {
      try {
        const itemsResponse = await axios.get<Item[]>(
          "http://my-json-server.typicode.com/Gh05d/lend-g-app/items",
        );

        const requestsResponse = await axios.get<Request[]>(
          "http://mock-api.com/requests",
        );

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
    })();
  }, []);

  const handleViewRequests = (itemID: string) => {
    navigation.navigate("Requests", {itemID});
  };

  const renderItem = ({item}: {item: Item}) => (
    <View style={[styles.itemContainer, {backgroundColor: colors.card}]}>
      <AppText bold>{item.title}</AppText>
      <AppText>Preis: {item.price} €</AppText>
      {item.rentedPeriods && <AppText>Verliehen: {item.rentedPeriods}</AppText>}
      <AppButton
        title="Anfragen anzeigen"
        onPress={() => handleViewRequests(item.id)}
        color={colors.primary}
      />
    </View>
  );

  const sections = [
    {
      title: "Offene Anfragen",
      data: pendingRequests.map(request => ({
        id: request.itemID,
        title: request.userID,
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
      <AppText bold style={styles.title}>
        Meine Artikel
      </AppText>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({item, section}) => section.renderItem({item})}
        renderSectionHeader={({section}) => (
          <AppText style={styles.sectionTitle}>{section.title}</AppText>
        )}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {fontSize: 24, textAlign: "center", marginBottom: 16},
  sectionTitle: {fontSize: 20, marginVertical: 12},
  itemContainer: {padding: 16, marginVertical: 8, borderRadius: 8},
});

export default ManageItemsScreen;
