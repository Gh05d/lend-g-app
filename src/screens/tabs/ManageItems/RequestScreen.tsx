import React, {useEffect, useState} from "react";
import {StyleSheet, View, TextInput, Alert} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {CompositeScreenProps, useTheme} from "@react-navigation/native";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import axios from "axios";
import dayjs from "dayjs";

import AppText from "../../../components/AppText";
import AppButton from "../../../components/AppButton";
import ScreenWrapper from "../../../components/ScreenWrapper";
import {formatPrice, germanDate} from "../../../common/functions";
import {boxShadow} from "../../../common/variables";

type Props = CompositeScreenProps<
  StackScreenProps<ManageItemsStackParamList, "Requests">,
  BottomTabScreenProps<TabParamList, "ManageItemsStack">
>;

const RequestScreen: React.FC<Props> = ({route, navigation}) => {
  const {requestID} = route.params;
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
        const {data} = await axios.get<{request: Request}>(
          `/api/requests/${requestID}`,
        );

        const foundRequest = data?.request;
        setRequest(foundRequest);

        if (foundRequest) {
          const userResponse = await axios.get<{user: User}>(
            `/api/users/${foundRequest.ownerID}`,
          );
          setUser(userResponse.data.user);

          const defaultPrice =
            parseFloat(foundRequest.price.replace("€", "")) *
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
  }, [requestID]);

  function calculateDays(startDate: string, endDate: string) {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    return end.diff(start, "day") + 1;
  }

  function calculatePrice(pricePerDay: string, days: number) {
    const price = parseFloat(pricePerDay.replace("€", ""));
    return (price * days).toFixed(2);
  }

  const days = request
    ? calculateDays(request.timeFrame.startDate, request.timeFrame.endDate)
    : 0;

  const price = request ? calculatePrice(request.price, days) : "0.00";

  const handleApprove = async (requestID: string) => {
    Alert.alert(
      "Anfrage genehmigt",
      `Nutzer ${user?.userName} bekommt eine Bestätigung. Bitte bereite die Übergabe vor.`,
      [{onPress: () => navigation.goBack()}],
    );
  };

  const handleReject = (requestID: string) => {
    console.log(`Rejected request: ${requestID}`);
    navigation.goBack();
  };

  function handleContactUser() {
    if (user)
      navigation.navigate("ChatsStack", {
        screen: "Chat",
        params: {userName: user.userName!, profilePicture: user.profilePicture},
      });
  }

  return (
    <ScreenWrapper loading={loading} error={error}>
      <View
        style={[styles.container, {backgroundColor: colors.card, boxShadow}]}>
        <AppText textSize="heading" bold>
          Anfrage von: {user?.userName || "Laden..."}
        </AppText>
        <AppText>Anzahl der Tage: {days}</AppText>
        <AppText>
          Zeitraum: {germanDate(request?.timeFrame.startDate)} -{" "}
          {germanDate(request?.timeFrame.endDate)}
        </AppText>

        <View style={{gap: 12, marginTop: 12}}>
          <AppText>
            Preis: {price} € ({formatPrice(request?.price)})
          </AppText>

          {request?.status == "open" ? (
            <View style={styles.inlineInput}>
              <AppText style={{flex: 3}}>Kaution:</AppText>
              <TextInput
                editable={request?.status == "open"}
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
                  setTotalPrice(+price + numericValue);
                }}
                keyboardType="numeric"
                placeholder="Kaution eingeben"
                style={[
                  styles.input,
                  {backgroundColor: colors.card, color: colors.text},
                ]}
              />
            </View>
          ) : (
            <View style={styles.inlineInput}>
              <AppText>Kaution: </AppText>
              <AppText>{deposit} €</AppText>
            </View>
          )}

          <AppText textSize="large" bold>
            Gesamt: {totalPrice.toFixed(2)} €
          </AppText>
        </View>

        <View style={{marginTop: "auto", gap: 12}}>
          {request?.status == "open" && (
            <>
              <AppButton
                title="Genehmigen"
                onPress={() => handleApprove(request?.id || "")}
              />
              <AppButton
                outline
                title="Ablehnen"
                onPress={() => handleReject(request?.id || "")}
              />
            </>
          )}
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
