import React, {useContext, useState} from "react";
import {Image, StyleSheet, useWindowDimensions, View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as bip39 from "bip39";
import * as Keychain from "react-native-keychain";
import {Keypair} from "@solana/web3.js";
import axios from "axios";
import {useTheme} from "@react-navigation/native";

import ScreenWrapper from "../../components/ScreenWrapper";
import AppText from "../../components/AppText";
import AppButton from "../../components/AppButton";
import Error from "../../components/Error";
import AppModal from "../../components/modals/AppModal";
import {
  authContainer,
  UserContext,
  WALLET_ADDRESS,
} from "../../common/variables";
import DynamicTextLoadingModal from "../../components/modals/DynamicTextLoadingModal";

type Props = StackScreenProps<AuthStackParamList, "SignUp">;

const SignUpScreen: React.FC<Props> = ({navigation}) => {
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<null | User>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  const {colors} = useTheme();
  const {height} = useWindowDimensions();

  const {setUser} = useContext(UserContext);

  async function handleCreateNewWallet() {
    try {
      const newMnemonic = bip39.generateMnemonic();
      const seed = await bip39.mnemonicToSeed(newMnemonic);

      // Derive a wallet from the seed
      const seedArray = new Uint8Array(seed);
      const keypair = Keypair.fromSeed(seedArray.slice(0, 32));

      const publicKey = keypair.publicKey.toBase58();

      const {data} = await axios.post<{user: User}>("/api/user", {
        walletAddress: publicKey,
      });

      // Save private key securely
      await Keychain.setGenericPassword(
        publicKey,
        Buffer.from(keypair.secretKey).toString("base64"),
        {
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
          accessControl: Keychain.ACCESS_CONTROL.USER_PRESENCE,
        },
      );

      AsyncStorage.setItem(WALLET_ADDRESS, publicKey);
      setMnemonic(newMnemonic);
      setNewUser(data.user);
    } catch (err) {
      AsyncStorage.removeItem(WALLET_ADDRESS);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenWrapper
      style={{justifyContent: "center", gap: 24}}
      loading={false}
      error={null}>
      <View style={[authContainer, {backgroundColor: colors.card}]}>
        <Image
          source={require("../../../assets/wallet-illustration.png")}
          style={[styles.image, {height: height / 3}]}
        />
        <AppText textSize="heading" style={styles.title}>
          Sign Up - Herzlich Willkommen
        </AppText>

        <AppButton
          title="Neue Wallet anlegen"
          onPress={async () => {
            // WORKAROUND: Otherwise the loading modal does not appear
            await setLoading(true);

            setTimeout(handleCreateNewWallet, 200);
          }}
        />
        <AppButton
          outline
          title="Bestehende Wallet nutzen"
          onPress={() => navigation.navigate("Login")}
        />

        <Error error={error} />
        <DynamicTextLoadingModal
          sentences={[
            "Erstelle Wallet",
            "Generiere Seed",
            "Lade Hypervisor",
            "Verbinde zum Netzwerk",
            "Erstelle Mnemonic",
          ]}
          loading={loading}
        />

        <AppModal show={!!mnemonic}>
          <AppText bold textSize="large">
            WICHTIG! Diese Worte brauchst du um deine Wallet wiederherzustellen.
            Notiere Sie an einem sicheren Platz. LendG hat keinen Zugriff auf
            diese Daten!
          </AppText>
          <AppText selectable selectionColor={colors.primary}>
            {mnemonic}
          </AppText>

          <AppButton
            onPress={() => {
              setMnemonic(null);
              setUser(newUser!);
            }}
            title="Schließen und Bestätigen"
          />
        </AppModal>
      </View>
    </ScreenWrapper>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  title: {textAlign: "center", marginBottom: 24},
  image: {width: "100%"},
});
