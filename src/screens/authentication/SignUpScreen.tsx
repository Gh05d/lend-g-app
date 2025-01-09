import React from "react";
import {StyleSheet} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";

import ScreenWrapper from "../../components/ScreenWrapper";
import AppText from "../../components/AppText";
import AppButton from "../../components/AppButton";

type Props = StackScreenProps<AuthStackParamList, "Login">;

const SignUpScreen: React.FC<Props> = ({navigation}) => (
  <ScreenWrapper
    style={{justifyContent: "center", gap: 24}}
    loading={false}
    error={null}>
    <AppText bold textSize="heading" style={styles.title}>
      Sign Up
    </AppText>
    <AppText textSize="large" style={styles.title}>
      Herzlich Willkommen
    </AppText>

    <AppButton
      title="Bestehende Wallet nutzen"
      onPress={() => navigation.navigate("UseExistingWallet")}
    />
    <AppButton
      title="Neue Wallet anlegen"
      onPress={() => navigation.navigate("NewWallet")}
    />
  </ScreenWrapper>
);

export default SignUpScreen;

const styles = StyleSheet.create({
  title: {textAlign: "center", marginBottom: 24},
});
