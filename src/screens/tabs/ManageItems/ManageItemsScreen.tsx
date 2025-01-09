import React, {useCallback, useContext, useEffect, useState} from "react";
import {
  SectionList,
  StyleSheet,
  View,
  RefreshControl,
  Alert,
} from "react-native";
import {CompositeScreenProps, useTheme} from "@react-navigation/native";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import axios from "axios";

import AppText from "../../../components/AppText";
import AppButton from "../../../components/AppButton";
import ScreenWrapper from "../../../components/ScreenWrapper";
import QRCodeModal from "../../../components/modals/QRCodeModal";
import {UserContext} from "../../../common/variables";
import {StackScreenProps} from "@react-navigation/stack";
import {germanDate} from "../../../common/functions";

type Props = CompositeScreenProps<
  StackScreenProps<ManageItemsStackParamList, "ManageItems">,
  BottomTabScreenProps<TabParamList, "ManageItemsStack">
>;

const ManageItemsScreen: React.FC<Props> = ({route, navigation}) => {
  const [pendingRequests, setPendingRequests] = useState<FullRequest[]>([]);
  const [confirmedRequests, setConfirmedRequests] = useState<FullRequest[]>([]);
  const [itemsLent, setItemsLent] = useState<FullRequest[]>([]);
  const [itemsBorrowed, setItemsBorrowed] = useState<FullRequest[]>([]);
  const [rentalHistory, setRentalHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const {requestID} = route?.params;

  const {colors} = useTheme();
  const currentUser = useContext(UserContext);
  const ownUserID = currentUser!.id;

  async function fetchData() {
    try {
      const [requestsResponse, itemsRentedBy] = await Promise.all([
        axios.get<FullRequest[]>(`/api/requests/to-user`, {
          params: {ownerID: ownUserID},
        }),
        axios.get<FullRequest[]>(`/api/requests/from-user`, {
          params: {requesterID: ownUserID, status: "active"},
        }),
      ]);

      setItemsLent(
        requestsResponse.data.filter(request => request.status == "active"),
      );
      setPendingRequests(
        requestsResponse.data.filter(request => request.status == "open"),
      );
      setConfirmedRequests(
        requestsResponse.data.filter(request => request.status == "accepted"),
      );
      setRentalHistory(
        requestsResponse.data.filter(request => request.status == "closed"),
      );
      setItemsBorrowed(itemsRentedBy.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    (async function confirm() {
      try {
        setLoading(true);
        const res = await axios.patch("/api/qr/scan", {
          requestID,
        });

        if (!res.data.success) throw Error("Something went wrong");
        Alert.alert(
          "Übergabe bestätigt",
          "Vielen Dank. Der Artikel wurde erfolgeich übergeben",
        );
      } catch (err) {
        console.error(err as Error);
        Alert.alert(
          "Bestätigung fehlgeschlagen",
          "Leider ist etwas schiefgelaufen. Bitte versuche erneut den Code zu scannen.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [requestID]);

  async function debug(data: {requestID: string}) {
    try {
      setLoading(true);
      const res = await axios.patch("/api/qr/scan", data);
      console.log("🚀 ~ confirm ~ res:", res);
      await fetchData();

      Alert.alert(
        "Übergabe bestätigt",
        "Vielen Dank. Der Artikel wurde erfolgeich übergeben",
      );
    } catch (err) {
      console.error(err as Error);
      Alert.alert(
        "Bestätigung fehlgeschlagen",
        "Leider ist etwas schiefgelaufen. Bitte versuche erneut den Code zu scannen.",
      );
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleQRCode = (request: FullRequest) => {
    setQrCodeValue(`lendg://transaction?requestID=${request.id}`);
    setModalVisible(true);
  };

  const renderGenericItem = useCallback(
    ({item}: {item: FullRequest}) => (
      <View style={[styles.itemContainer, {backgroundColor: colors.card}]}>
        <AppText textSize="large" bold>
          {item.item.title}
        </AppText>
        <AppText>
          {item.status === "open" ? "Anfrage" : "Gemietet"} von:{" "}
          {item.requester.userName}
        </AppText>
        <AppText>{`Zeitraum: ${germanDate(
          item.timeFrame.startDate,
        )} - ${germanDate(item.timeFrame.endDate)}`}</AppText>
        <>
          {(item.status == "accepted" || item.status == "active") && (
            <AppButton
              style={{marginTop: 12}}
              title="Details anzeigen"
              onPress={() =>
                navigation.navigate("Requests", {requestID: item.id})
              }
            />
          )}
          <AppButton
            title="QR-Code anzeigen"
            onPress={() => debug({requestID: item.id})}
            color={colors.primary}
          />
        </>
      </View>
    ),
    [colors.card, colors.primary],
  );

  const sections = [
    {
      title: "Offene Anfragen",
      data: pendingRequests,
      renderItem: ({item}: {item: FullRequest}) => renderGenericItem({item}),
      emptyText: "Keine offenen Anfragen",
    },
    {
      title: "Angenommene Anfragen",
      data: confirmedRequests,
      renderItem: ({item}: {item: FullRequest}) => renderGenericItem({item}),
      emptyText: "Keine angenommenen Anfragen",
    },
    {
      title: "Verliehene Artikel",
      data: itemsLent,
      renderItem: ({item}: {item: FullRequest}) => renderGenericItem({item}),
      emptyText: "Keine verliehenen Artikel",
    },
    {
      title: "Geliehene Artikel",
      data: itemsBorrowed,
      renderItem: ({item}: {item: FullRequest}) => renderGenericItem({item}),
      emptyText: "Keine geliehenen Artikel",
    },
    {
      title: "Vergangene Transaktionen",
      data: rentalHistory,
      renderItem: ({item}: {item: FullRequest}) => renderGenericItem({item}),
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

      <QRCodeModal
        show={modalVisible}
        close={() => setModalVisible(false)}
        qrCodeValue={qrCodeValue!}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {marginVertical: 12},
  itemContainer: {padding: 16, gap: 12, marginBottom: 24, borderRadius: 8},
});

export default ManageItemsScreen;
