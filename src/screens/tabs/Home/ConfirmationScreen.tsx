import React, {useEffect, useState} from "react";
import {Alert, StyleSheet, View} from "react-native";
import {useTheme} from "@react-navigation/native";
import axios from "axios";
import dayjs from "dayjs";
import type {StackScreenProps} from "@react-navigation/stack";
import AppText from "../../../components/AppText";
import AppButton from "../../../components/AppButton";
import ScreenWrapper from "../../../components/ScreenWrapper";

type Props = StackScreenProps<StackParamList, "Confirmation">;

const ConfirmationScreen: React.FC<Props> = ({route, navigation}) => {
  const {itemID, userID, totalPrice, dateRange} = route.params;
  const {colors} = useTheme();

  const [item, setItem] = useState<Item | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async function fetchData() {
      try {
        const [itemResponse, userResponse] = await Promise.all([
          axios.get<Item>(
            `http://my-json-server.typicode.com/Gh05d/lend-g-app/items/${itemID}`,
          ),
          axios.get<User>(`https://dummyjson.com/users/${userID}`),
        ]);
        setItem(itemResponse.data);
        setUser(userResponse.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, [itemID, userID]);

  const handleConfirm = () => {
    Alert.alert(
      "Anfrage bestätigt",
      "Deine Anfrage wurde erfolgreich erstellt. Der Eigentümer wird sich mit dir in Verbindung setzen.",
      [{text: "OK", onPress: () => navigation.navigate("HomeScreen")}],
    );
  };

  const handleCancel = () => navigation.goBack();

  return (
    <ScreenWrapper loading={loading} error={error}>
      <AppText bold style={styles.title}>
        Übersicht
      </AppText>

      <AppText style={styles.text}>Artikel: {item?.title}</AppText>
      <AppText style={styles.text}>
        Zeitraum: {dayjs(dateRange.startDate).format("DD.MM.YYYY")} -{" "}
        {dayjs(dateRange.endDate).format("DD.MM.YYYY")}
      </AppText>
      <AppText style={styles.text}>Gesamtpreis: {totalPrice} €</AppText>
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
        <AppButton title="Bestätigen" onPress={handleConfirm} />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {fontSize: 24, textAlign: "center", marginBottom: 16},
  text: {fontSize: 16, marginBottom: 12},
  buttonContainer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default ConfirmationScreen;
