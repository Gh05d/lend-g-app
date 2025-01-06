import React, {useEffect, useState} from "react";
import {StyleSheet, Alert, View, Image} from "react-native";
import {CompositeScreenProps, useTheme} from "@react-navigation/native";
import axios from "axios";
import type {StackScreenProps} from "@react-navigation/stack";
import type {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {DateType} from "react-native-ui-datepicker";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

import ScreenWrapper from "../../../components/ScreenWrapper";
import AppText from "../../../components/AppText";
import AppButton from "../../../components/AppButton";
import DateRangePickerModal from "../../../components/modals/DateRangePickerModal";

type Props = CompositeScreenProps<
  StackScreenProps<HomeStackParamList, "ItemDetails">,
  BottomTabScreenProps<TabParamList, "Chat">
>;

const ItemDetailsScreen: React.FC<Props> = ({route, navigation}) => {
  const {id, userID} = route.params;

  const [item, setItem] = useState<Item | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);

  const {colors} = useTheme();

  useEffect(() => {
    (async function fetchDetails() {
      try {
        const [itemResponse, userResponse] = await Promise.all([
          axios.get<Item>(
            `http://my-json-server.typicode.com/Gh05d/lend-g-app/items/${id}`,
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
  }, [id, userID]);

  const isAvailable = item?.rentedPeriods
    ? !parseRentedPeriods(item.rentedPeriods).some(
        period =>
          new Date() &&
          dayjs(new Date()).isBetween(
            period.startDate,
            period.endDate,
            null,
            "[]",
          ),
      )
    : true;

  function parseRentedPeriods(rentedPeriods: string) {
    return rentedPeriods.split(",").map(range => {
      const [start, end] = range.split(":");
      const startDate = dayjs(start.trim());
      const endDate = dayjs(end.trim());

      if (!startDate.isValid() || !endDate.isValid()) {
        throw new Error(`Invalid date range: ${range}`);
      }

      return {startDate, endDate};
    });
  }

  function handleSubmit(dateRange: DateRangeType) {
    const isConflict = item?.rentedPeriods
      ? parseRentedPeriods(item.rentedPeriods).some(
          period =>
            dayjs(dateRange.startDate).isBetween(
              period.startDate,
              period.endDate,
              null,
              "[]",
            ) ||
            dayjs(dateRange.endDate).isBetween(
              period.startDate,
              period.endDate,
              null,
              "[]",
            ) ||
            dayjs(period.startDate).isBetween(
              dateRange.startDate,
              dateRange.endDate,
              null,
              "[]",
            ) ||
            dayjs(period.endDate).isBetween(
              dateRange.startDate,
              dateRange.endDate,
              null,
              "[]",
            ),
        )
      : false;

    if (isConflict) {
      return Alert.alert(
        "Eingeschränkte Verfügbarkeit",
        "Das Objekt ist für den gewählten Zeitraum nicht durchgehend verfügbar. Bitte wähle einen anderen Zeitrahmen.",
      );
    }

    const duration = dayjs(dateRange.endDate).diff(
      dayjs(dateRange.startDate),
      "day",
    );

    navigation.navigate("Confirmation", {
      itemID: item!.id,
      userID: user!.id,
      totalPrice: duration * parseInt(item!.price.slice(1), 10),
      dateRange,
    });

    setShow(false);
  }

  function renderPricing() {
    const purePrice = parseInt(item?.price.replace(" € / Tag", ""), 10);

    const pricingIntervals = [
      {label: "Täglich", price: item?.price},
      {
        label: "Wöchentlich",
        price: item && `${(purePrice * 7 * 0.9).toFixed(2)} € / Woche`,
      },
      {
        label: "Monatlich",
        price: item && `${(purePrice * 30 * 0.7).toFixed(2)} € / Monat`,
      },
    ];

    return (
      <View style={styles.pricingContainer}>
        {pricingIntervals.map((interval, index) => (
          <View key={index} style={styles.pricingRow}>
            <AppText>{interval.label}</AppText>
            <AppText bold style={{color: colors.primary}}>
              {interval?.price}
            </AppText>
          </View>
        ))}
      </View>
    );
  }

  function isDateDisabled(date: DateType) {
    if (!item?.rentedPeriods) return false;

    return parseRentedPeriods(item.rentedPeriods).some(period =>
      dayjs(date).isBetween(period.startDate, period.endDate, null, "[]"),
    );
  }

  function navigateToChat() {
    if (user) navigation.navigate("Chat", {userID: user.id});
  }

  return (
    <ScreenWrapper style={{gap: 12}} loading={loading} error={error}>
      <AppText textSize="heading" bold>
        {item?.title}
      </AppText>
      <AppText textSize="large">
        Kategorie: {item?.category || "Nicht verfügbar"}
      </AppText>
      <AppText
        textSize="large"
        bold
        style={[styles.price, {color: colors.primary}]}>
        Preis: {item?.price}
      </AppText>
      <AppText style={styles.description}>
        Beschreibung: {item?.description || "Keine Beschreibung verfügbar."}
      </AppText>

      {renderPricing()}

      <View style={styles.availabilityContainer}>
        <AppButton
          onPress={() => setShow(true)}
          title={isAvailable ? "Datum auswählen" : "Nicht verfügbar"}
          color={isAvailable ? colors.secondary : colors.error}
        />

        <DateRangePickerModal
          show={show}
          close={() => setShow(false)}
          submit={handleSubmit}
          disabledDates={isDateDisabled}
        />
      </View>

      {user && (
        <View style={[styles.userContainer, {backgroundColor: colors.card}]}>
          <AppText bold textSize="heading">
            Eigentümer Informationen
          </AppText>

          <View style={styles.userData}>
            <Image source={{uri: user.image}} style={styles.userImage} />
            <View style={styles.userInfo}>
              <AppText>
                Name: {user.firstName} {user.lastName}
              </AppText>
              <AppText>Email: {user.email}</AppText>
              <AppText>Telefon: {user.phone}</AppText>
            </View>
          </View>

          <AppButton onPress={navigateToChat} title="Chat mit Eigentümer" />
        </View>
      )}
    </ScreenWrapper>
  );
};

export default ItemDetailsScreen;

const styles = StyleSheet.create({
  price: {marginBottom: 16},
  description: {fontSize: 16},
  pricingContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  availabilityContainer: {marginVertical: 32, alignItems: "center", gap: 12},
  userContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  userData: {flexDirection: "row", gap: 16},
  userImage: {width: 60, height: 60, borderRadius: 25},
  userInfo: {flex: 1, gap: 8},
});
