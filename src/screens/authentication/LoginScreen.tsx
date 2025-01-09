import React, {useState} from "react";
import {StyleSheet, Pressable, Alert, Linking} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {useTheme} from "@react-navigation/native";
import {Connection, clusterApiUrl} from "@solana/web3.js";
import {
  transact,
  Web3MobileWallet,
} from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";

import ScreenWrapper from "../../components/ScreenWrapper";
import AppText from "../../components/AppText";
import AppButton from "../../components/AppButton";
import {UserContext} from "../../common/variables";
import LoadingModal from "../../components/LoadingModal";
import Error from "../../components/Error";

const APP_IDENTITY = {
  name: "LendG dApp",
  uri: "https://lendg.de",
  icon: "https://github.com/favicon.ico", // Full path resolves to https://yourdapp.com/favicon.ico
};

type Props = StackScreenProps<AuthStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  const {colors} = useTheme();

  async function handleConnectWallet() {
    try {
      await setLoading(true);
      const authorizationResult = await transact(
        async (wallet: Web3MobileWallet) => {
          const authorizationRes = await wallet.authorize({
            cluster: "solana:devnet",
            identity: APP_IDENTITY,
          });

          /* After approval, signing requests are available in the session. */

          return authorizationRes;
        },
      );
      console.log("Connected to: " + authorizationResult.accounts[0].address);
      // const adapter = new MobileWalletAdapter();
      // const connection = new Connection(clusterApiUrl("devnet"));

      // const [publicKey] = await adapter.connect();
      // setWalletAddress(publicKey.toBase58());

      // console.info("Connected to wallet:", publicKey.toBase58());
    } catch (err) {
      if ((error as Error).message.includes("No wallet app installed")) {
        Alert.alert(
          "Wallet nicht gefunden",
          "Es scheint, dass keine kompatible Wallet-App installiert ist. Möchtest du eine Wallet-App herunterladen?",
          [
            {text: "Abbrechen", style: "cancel"},
            {
              text: "Zum App Store",
              onPress: () => Linking.openURL("https://phantom.app/download"),
            },
          ],
        );
      } else setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenWrapper
      style={{justifyContent: "center", gap: 24}}
      loading={false}
      error={null}>
      <AppText bold textSize="heading" style={styles.title}>
        Login
      </AppText>
      <AppText textSize="large" style={styles.title}>
        Willkommen zurück
      </AppText>
      <AppText>
        Wallet-Adresse: {walletAddress || "Noch nicht verbunden"}
      </AppText>
      <AppButton title="Mit Wallet verbinden" onPress={handleConnectWallet} />

      <Pressable
        accessibilityHint="Registrieren Button"
        onPress={() => navigation.navigate("SignUp")}>
        <AppText style={{color: colors.secondary}}>
          Noch kein Account? Registrieren!
        </AppText>
      </Pressable>

      <Error error={error} />
      <LoadingModal loading={loading} />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {textAlign: "center", marginBottom: 24},
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default LoginScreen;
