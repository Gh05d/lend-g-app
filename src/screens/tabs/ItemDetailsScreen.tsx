import React, {useEffect, useState} from "react";
import {StyleSheet, View, Image} from "react-native";
import {useTheme} from "@react-navigation/native";
import axios from "axios";
import type {StackScreenProps} from "@react-navigation/stack";

import ScreenWrapper from "../../components/ScreenWrapper";
import AppText from "../../components/AppText";
import AppButton from "../../components/AppButton";
import DatePickerModal from "../../components/modals/DatePickerModal";

type Props = StackScreenProps<StackParamList, "ItemDetails">;

const ItemDetailsScreen: React.FC<Props> = ({route}) => {
  const {id, userID} = route.params;
  const [item, setItem] = useState<Item | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [show, setShow] = React.useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeType>({
    startDate: null,
    endDate: null,
  });
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
          (selectedDateRange.startDate >= period.startDate &&
            selectedDateRange.startDate <= period.endDate) ||
          (selectedDateRange.endDate >= period.startDate &&
            selectedDateRange.endDate <= period.endDate),
      )
    : true;

  function parseRentedPeriods(rentedPeriods: string) {
    return rentedPeriods.split(",").map(range => {
      const [start, end] = range.split(":");
      const startDate = new Date(start.trim());
      const endDate = new Date(end.trim());
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error(`Invalid date range: ${range}`);
      }
      return {startDate, endDate};
    });
  }

  function handleSubmit(dateRange: DateRangeType) {
    setShow(false);
    setSelectedDateRange(dateRange);
  }

  function renderPricing() {
    const pricingIntervals = [
      {label: "Täglich", price: item?.price},
      {
        label: "Wöchentlich",
        price: item && `$${parseInt(item.price.slice(1), 10) * 7} / Woche`,
      },
      {
        label: "Monatlich",
        price: item && `$${parseInt(item.price.slice(1), 10) * 30} / Monat`,
      },
    ];

    return (
      <View style={styles.pricingContainer}>
        {pricingIntervals.map((interval, index) => (
          <View key={index} style={styles.pricingRow}>
            <AppText>{interval.label}</AppText>
            <AppText bold style={{color: colors.primary}}>
              {interval.price}
            </AppText>
          </View>
        ))}
      </View>
    );
  }

  return (
    <ScreenWrapper loading={loading} error={error}>
      <AppText bold style={styles.title}>
        {item?.title}
      </AppText>
      <AppText style={styles.category}>
        Kategorie: {item?.category || "Nicht verfügbar"}
      </AppText>
      <AppText bold style={[styles.price, {color: colors.primary}]}>
        Preis: {item?.price}
      </AppText>
      <AppText style={styles.description}>
        Beschreibung: {item?.description || "Keine Beschreibung verfügbar."}
      </AppText>

      {renderPricing()}

      <View style={styles.availabilityContainer}>
        <AppButton
          onPress={() => setShow(true)}
          title={isAvailable ? "Verfügbar" : "Nicht verfügbar"}
          color={isAvailable ? colors.secondary : colors.error}
        />

        <DatePickerModal
          show={show}
          close={() => setShow(false)}
          submit={handleSubmit}
        />
      </View>

      {user && (
        <View style={[styles.userContainer, {backgroundColor: colors.card}]}>
          <AppText bold style={styles.userTitle}>
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
        </View>
      )}
    </ScreenWrapper>
  );
};

export default ItemDetailsScreen;

const styles = StyleSheet.create({
  title: {fontSize: 24, marginBottom: 8},
  category: {fontSize: 18, marginBottom: 8},
  price: {fontSize: 20, marginBottom: 16},
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
  userInfo: {flex: 1},
  userTitle: {fontSize: 20},
});
