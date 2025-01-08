import React, {useEffect, useState} from "react";
import {Alert, StyleSheet, View} from "react-native";
import {useTheme} from "@react-navigation/native";
import type {StackScreenProps} from "@react-navigation/stack";
import axios from "axios";
import dayjs from "dayjs";

import AppText from "../../../components/AppText";
import AppButton from "../../../components/AppButton";
import ScreenWrapper from "../../../components/ScreenWrapper";

type Props = StackScreenProps<HomeStackParamList, "Confirmation">;

const ConfirmationScreen: React.FC<Props> = ({route, navigation}) => {
  const {itemID, userID, totalPrice, dateRange} = route.params;

  const parsedDateRange: DateRangeType = JSON.parse(dateRange);

  const {colors} = useTheme();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async function fetchData() {
      try {
        const itemResponse = await axios.get<{item: Item}>(
          `/api/items/${itemID}`,
        );

        setItem(itemResponse.data.item);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, [itemID, userID]);

  async function handleConfirm() {
    try {
      await axios.post("/api/requests", {
        userID: userID,
        itemID: itemID,
        price: `€${totalPrice}`,
        timeFrame: parsedDateRange,
        status: "open",
      });

      Alert.alert(
        "Anfrage bestätigt",
        "Deine Anfrage wurde erfolgreich erstellt. Der Eigentümer wird sich mit dir in Verbindung setzen.",
        [{text: "OK", onPress: () => navigation.navigate("HomeScreen")}],
      );
    } catch (err) {
      Alert.alert(
        "Fehler",
        "Die Anfrage konnte nicht erstellt werden. Bitte versuche es erneut.",
      );
    }
  }

  const handleCancel = () => navigation.goBack();
  const duration =
    dayjs(parsedDateRange.endDate).diff(
      dayjs(parsedDateRange.startDate),
      "day",
    ) + 1;

  return (
    <ScreenWrapper loading={loading} error={error}>
      <AppText textSize="heading" bold style={styles.title}>
        Übersicht
      </AppText>

      <AppText style={styles.text}>Artikel: {item?.title}</AppText>
      <AppText style={styles.text}>
        Zeitraum: {dayjs(parsedDateRange.startDate).format("DD.MM.YYYY")} -{" "}
        {dayjs(parsedDateRange.endDate).format("DD.MM.YYYY")} ({duration} Tage)
      </AppText>
      <AppText bold style={styles.text}>
        Gesamtpreis: {totalPrice} €
      </AppText>
      {item?.deposit && (
        <AppText style={styles.text}>
          Kaution: {item.deposit} € (wird nach Rückgabe erstattet)
        </AppText>
      )}

      <View style={styles.buttonContainer}>
        <AppButton
          title="Abbrechen"
          onPress={handleCancel}
          color={colors.error}
        />
        <AppButton title="Artikel anfragen" onPress={handleConfirm} />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {textAlign: "center", marginBottom: 16},
  text: {marginBottom: 12},
  buttonContainer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default ConfirmationScreen;
