import React, {useEffect, useState} from "react";
import {StyleSheet, View, TextInput} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import axios from "axios";
import dayjs from "dayjs";
import {useTheme} from "@react-navigation/native";

import AppText from "../../../components/AppText";
import AppButton from "../../../components/AppButton";
import ScreenWrapper from "../../../components/ScreenWrapper";

interface Request {
  id: string;
  userID: string;
  itemID: string;
  timeFrame: {startDate: string; endDate: string};
  price: string;
}

interface User {
  id: string;
  username: string;
}

type Props = StackScreenProps<ManageItemsStackParamList, "Requests">;

const RequestScreen: React.FC<Props> = ({route, navigation}) => {
  const {itemID} = route.params as {itemID: string};
  const [request, setRequest] = useState<Request>();
  const [user, setUser] = useState<User | null>(null);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [deposit, setDeposit] = useState<string>("0.00");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {colors} = useTheme();

  useEffect(() => {
    const fetchRequestAndUser = async () => {
      try {
        const {data} = await axios.get<Request[]>(
          `http://my-json-server.typicode.com/Gh05d/lend-g-app/requests/`,
        );
        const foundRequest = data.find(item => item.itemID === itemID);
        setRequest(foundRequest);

        if (foundRequest) {
          const userResponse = await axios.get<User>(
            `https://dummyjson.com/users/${foundRequest.userID}`,
          );
          setUser(userResponse.data);

          const defaultPrice =
            parseFloat(
              foundRequest.price.replace("/day", "").replace("$", ""),
            ) *
            calculateDays(
              foundRequest.timeFrame.startDate,
              foundRequest.timeFrame.endDate,
            );

          const defaultDeposit = (defaultPrice * 0.1).toFixed(2);

          setDeposit(defaultDeposit);
          setTotalPrice(defaultPrice + +defaultDeposit);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestAndUser();
  }, [itemID]);

  function calculateDays(startDate: string, endDate: string) {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    return end.diff(start, "day") + 1;
  }

  function calculatePrice(pricePerDay: string, days: number) {
    const price = parseFloat(pricePerDay.replace("/day", "").replace("$", ""));
    return (price * days).toFixed(2);
  }

  const days = request
    ? calculateDays(request.timeFrame.startDate, request.timeFrame.endDate)
    : 0;

  const price = request ? calculatePrice(request.price, days) : "0.00";

  const handleApprove = (requestID: string) => {
    console.log(`Approved request: ${requestID}`);
  };

  const handleReject = (requestID: string) => {
    console.log(`Rejected request: ${requestID}`);
    navigation.goBack();
  };

  const handleContactUser = () => {
    navigation.navigate("Chat", {userID: user?.id});
  };

  return (
    <ScreenWrapper loading={loading} error={error}>
      <View style={[styles.container, {backgroundColor: colors.card}]}>
        <AppText textSize="heading" bold>
          Anfrage von: {user?.username || "Laden..."}
        </AppText>
        <AppText>Anzahl der Tage: {days}</AppText>
        <AppText>
          Zeitraum: {request?.timeFrame.startDate} -{" "}
          {request?.timeFrame.endDate}
        </AppText>

        <View style={{gap: 12, marginTop: 12}}>
          <AppText>
            Preis: {price} € (
            {request?.price.replace("$", "").replace("/day", " € pro Tag")})
          </AppText>

          <View style={styles.inlineInput}>
            <AppText style={{flex: 3}}>Kaution:</AppText>
            <TextInput
              value={deposit}
              onChangeText={text => {
                const cleanedText = text.replace(/[^0-9.]/g, "");
                if (
                  /^\d*\.?\d*$/.test(cleanedText) &&
                  cleanedText.split(".").length <= 2
                ) {
                  setDeposit(cleanedText);
                }
              }}
              onBlur={() => {
                const numericValue = parseFloat(deposit);
                if (isNaN(numericValue) || numericValue < 0) {
                  setDeposit("0.00");
                }
                setTotalPrice(state => state + numericValue);
              }}
              keyboardType="numeric"
              placeholder="Kaution eingeben"
              style={[
                styles.input,
                {backgroundColor: colors.card, color: colors.text},
              ]}
            />
          </View>

          <AppText textSize="large" bold>
            Gesamt: {totalPrice} €
          </AppText>
        </View>

        <View style={{marginTop: "auto", gap: 12}}>
          <AppButton
            title="Genehmigen"
            onPress={() => handleApprove(request?.id || "")}
          />
          <AppButton
            outline
            title="Ablehnen"
            onPress={() => handleReject(request?.id || "")}
          />
          <AppButton
            title="Nutzer Kontaktieren"
            onPress={handleContactUser}
            color={colors.secondary}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
    borderRadius: 8,
    boxShadow: "0 0 4px rgba(0, 0, 0, 0.6)",
    marginBottom: 12,
    height: "100%",
  },
  inlineInput: {flexDirection: "row", alignItems: "center"},
  input: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    flex: 7,
  },
});

export default RequestScreen;
