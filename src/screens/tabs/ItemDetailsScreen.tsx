import React, {useEffect, useState} from "react";
import {StyleSheet, View, Image, Modal} from "react-native";
import {useTheme} from "@react-navigation/native";
import axios from "axios";
import type {StackScreenProps} from "@react-navigation/stack";
import DateTimePicker from "react-native-ui-datepicker";

import ScreenWrapper from "../../components/ScreenWrapper";
import AppText from "../../components/AppText";
import AppButton from "../../components/AppButton";

type Props = StackScreenProps<StackParamList, "ItemDetails">;

function parseRentedPeriods(rentedPeriods: string) {
  console.log(rentedPeriods);
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

const ItemDetailsScreen: React.FC<Props> = ({route}) => {
  const {id, userID} = route.params;
  const [item, setItem] = useState<Item | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [show, setShow] = React.useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({
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

  const onChange = params => setSelectedDateRange(params);

  function cancel() {
    setShow(false);
    setSelectedDateRange({startDate: null, endDate: null});
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

      <View style={styles.availabilityContainer}>
        <AppButton
          onPress={() => setShow(true)}
          title={isAvailable ? "Verfügbar" : "Nicht verfügbar"}
          color={isAvailable ? colors.secondary : colors.error}
        />
        <Modal
          animationType="slide"
          transparent
          visible={show}
          onRequestClose={cancel}>
          <View style={styles.modalContainer}>
            <View style={[styles.datePicker]}>
              <DateTimePicker
                mode="range"
                locale="de"
                minDate={new Date()}
                startDate={selectedDateRange.startDate}
                endDate={selectedDateRange.endDate}
                onChange={onChange}
              />

              <View style={styles.buttonContainer}>
                <AppButton
                  onPress={cancel}
                  color={colors.error}
                  title="Abbrechen"
                />
                <AppButton
                  onPress={() => setShow(false)}
                  color={colors.secondary}
                  title="Bestätigen"
                />
              </View>
            </View>
          </View>
        </Modal>
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
  availabilityContainer: {marginVertical: 32, alignItems: "center", gap: 12},
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  datePicker: {
    width: "80%",
    maxWidth: 360,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    shadowRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 0},
    backgroundColor: "#fff",
  },
  userContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 12,
  },
  userData: {flexDirection: "row", gap: 16},
  userImage: {width: 60, height: 60, borderRadius: 25},
  userInfo: {flex: 1},
  userTitle: {fontSize: 20},
});
