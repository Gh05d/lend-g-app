import React, {useCallback, useContext, useEffect, useState} from "react";
import {SectionList, StyleSheet, View, RefreshControl} from "react-native";
import {CompositeScreenProps, useTheme} from "@react-navigation/native";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import axios from "axios";

import AppText from "../../../components/AppText";
import AppButton from "../../../components/AppButton";
import ScreenWrapper from "../../../components/ScreenWrapper";
import {UserContext} from "../../../common/variables";
import {StackScreenProps} from "@react-navigation/stack";

type Props = CompositeScreenProps<
  StackScreenProps<ManageItemsStackParamList, "ManageItems">,
  BottomTabScreenProps<TabParamList, "ManageItemsStack">
>;

const ManageItemsScreen: React.FC<Props> = ({navigation}) => {
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [itemsLent, setItemsLent] = useState<Item[]>([]);
  const [itemsBorrowed, setItemsBorrowed] = useState<Item[]>([]);
  const [rentalHistory, setRentalHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const {colors} = useTheme();
  const currentUser = useContext(UserContext);
  const userID = currentUser!.id;

  async function fetchData() {
    try {
      const [requestsResponse, itemsResponse, itemsRentedBy] =
        await Promise.all([
          axios.get<Request[]>(`/api/requests/user/${userID}`),
          axios.get<{items: Item[]}>(`/api/items/user/${userID}`),
          axios.get<{items: Item[]}>(`/api/items/rentedBy/${userID}`),
        ]);

      setItemsLent(
        itemsResponse.data.items.filter(
          item => item.currentlyRentedBy && item.currentlyRentedBy != userID,
        ),
      );

      setPendingRequests(
        requestsResponse.data.filter(request => request.status == "open"),
      );

      setItemsBorrowed(itemsRentedBy.data.items);
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

  const renderItem = useCallback(
    ({item}: {item: any}) => (
      <View style={[styles.itemContainer, {backgroundColor: colors.card}]}>
        <AppText textSize="large" bold>
          {item.item.title}
        </AppText>
        <AppText>{`Vermietet an: ${item.requester.userName}`}</AppText>
        <AppText>{`Zeitraum: ${item.timeFrame.startDate} - ${item.timeFrame.endDate}`}</AppText>
        <AppButton
          style={{marginTop: 12}}
          title="Details anzeigen"
          onPress={() => navigation.navigate("Requests", {requestID: item.id})}
        />
      </View>
    ),
    [colors.card],
  );

  const sections = [
    {
      title: "Offene Anfragen",
      data: pendingRequests,
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
          <AppText textSize="heading" style={styles.sectionTitle}>
            {section.title}
          </AppText>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {marginVertical: 12},
  itemContainer: {padding: 16, gap: 12, marginBottom: 24, borderRadius: 8},
});

export default ManageItemsScreen;
