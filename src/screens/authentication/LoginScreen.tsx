import React, {useContext, useEffect, useState} from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Alert,
  Linking,
  Platform,
  Image,
  useWindowDimensions,
  TextInput,
} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {useTheme} from "@react-navigation/native";
import * as bip39 from "bip39";
import {
  transact,
  Web3MobileWallet,
} from "@solana-mobile/mobile-wallet-adapter-protocol";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Keypair} from "@solana/web3.js";
import * as Keychain from "react-native-keychain";

import ScreenWrapper from "../../components/ScreenWrapper";
import AppText from "../../components/AppText";
import AppButton from "../../components/AppButton";
import LoadingModal from "../../components/LoadingModal";
import Error from "../../components/Error";
import AppModal from "../../components/modals/AppModal";

import {
  APP_IDENTITY,
  authContainer,
  UserContext,
  WALLET_ADDRESS,
} from "../../common/variables";
import axios from "axios";

type Props = StackScreenProps<AuthStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [seedPhrase, setSeedPhrase] = useState("");
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);

  const {height} = useWindowDimensions();
  const {colors} = useTheme();
  const {setUser} = useContext(UserContext);

  async function handleConnectWallet() {
    try {
      await setLoading(true);

      // Use the transact function to handle wallet interactions
      const authorizationResult = await transact(
        async (wallet: Web3MobileWallet) => {
          const authResult = wallet.authorize({
            chain: "solana:devnet",
            identity: APP_IDENTITY,
          });

          return authResult;
        },
      );

      console.log("Connected to:", authorizationResult.accounts[0].address);
      setWalletAddress(authorizationResult.accounts[0].address);
    } catch (err) {
      if (
        (err as Error).message.includes(
          "Found no installed wallet that supports the mobile wallet protocol.",
        )
      ) {
        Alert.alert(
          "Wallet nicht gefunden",
          "Es scheint, dass keine kompatible Wallet-App installiert ist. Möchtest du eine Wallet-App herunterladen?",
          [
            {
              text: "Abbrechen",
              style: "cancel",
            },
            {
              text: "Zum App Store",
              onPress: () =>
                Linking.openURL(
                  Platform.OS == "android"
                    ? "https://play.google.com/store/apps/details?id=app.phantom"
                    : "https://apps.apple.com/app/phantom-wallet/id1598432977",
                ),
            },
          ],
        );
      } else {
        Alert.alert(
          "Fehler",
          "Verbindung mit der Wallet fehlgeschlagen. Bitte versuche es erneut.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  async function handlePrivateKeyLogin() {
    try {
      await setLoading(true);

      const credentials = await Keychain.getGenericPassword();
      if (!credentials) throw Error("No credentials!");

      const {username: publicKey, password: base64SecretKey} = credentials;

      // Convert the base64-encoded string back to Uint8Array
      const secretKey = new Uint8Array(Buffer.from(base64SecretKey, "base64"));

      // Recreate the wallet
      const keypair = Keypair.fromSecretKey(secretKey);

      if (keypair.publicKey.toBase58() != publicKey) {
        throw Error("Public keys don't match!");
      }

      const {data} = await axios.get<{user: User}>(`/api/login/${publicKey}`);
      setUser(data.user);
    } catch (err) {
      console.error("Fehler beim Login:", err);
      Alert.alert("Fehler", (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSeedLogin() {
    try {
      if (!bip39.validateMnemonic(seedPhrase)) {
        Alert.alert(
          "Ungültige Seed Phrase",
          "Bitte gib eine gültige Seed Phrase ein.",
        );
        return;
      }

      setLoading(true);

      // Convert seed phrase to seed
      const seed = await bip39.mnemonicToSeed(seedPhrase);
      const keypair = Keypair.fromSeed(new Uint8Array(seed).slice(0, 32));

      const publicKey = keypair.publicKey.toBase58();

      setWalletAddress(publicKey);

      // Optionally save the restored wallet
      await AsyncStorage.setItem(WALLET_ADDRESS, publicKey);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async function init() {
      try {
        const savedWallet = await AsyncStorage.getItem(WALLET_ADDRESS);

        if (savedWallet) return setWalletAddress(savedWallet);

        // Handle external wallet (via Mobile Wallet Adapter)
        const authorizationResult = await transact(
          async (wallet: Web3MobileWallet) => {
            return wallet.reauthorize({
              accounts: [{address: wallet}],
              identity: APP_IDENTITY,
            });
          },
        );

        if (authorizationResult) {
          setWalletAddress(authorizationResult.accounts[0].address);
        } else Alert.alert("Fehler", "Die Wallet-Verbindung ist abgelaufen.");
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <ScreenWrapper
      style={{justifyContent: "center", gap: 24}}
      loading={false}
      error={null}>
      <View style={[authContainer, {backgroundColor: colors.card}]}>
        <Image
          source={require("../../../assets/login-illustration.png")}
          style={[styles.image, {height: height / 3}]}
        />
        <AppText textSize="heading" style={styles.title}>
          Login - Willkommen zurück
        </AppText>

        <View style={styles.container}>
          <AppText style={{marginTop: 16}}>
            Wallet-Adresse: {walletAddress || "Noch nicht verbunden"}
          </AppText>
          <AppButton
            title="Mit Wallet einloggen"
            onPress={handlePrivateKeyLogin}
            disabled={!walletAddress}
          />

          <AppModal show={show} close={() => setShow(false)}>
            <TextInput
              style={[styles.input, {color: colors.text}]}
              placeholder="Seed Phrase eingeben"
              value={seedPhrase}
              onChangeText={setSeedPhrase}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />

            <View style={{gap: 16}}>
              <AppButton
                title="Seed Phrase verwenden"
                onPress={handleSeedLogin}
              />
              <AppButton
                outline
                title="Abbrechen"
                onPress={() => setShow(false)}
              />
            </View>
          </AppModal>

          <AppButton
            outline
            title="Externe Wallet nutzen"
            onPress={handleConnectWallet}
          />

          <Pressable
            accessibilityHint="Registrieren Button"
            onPress={() => navigation.navigate("SignUp")}>
            <AppText style={{color: colors.secondary}}>
              Noch keine Wallet? Registrieren!
            </AppText>
          </Pressable>

          <Pressable onPress={() => setShow(true)}>
            <AppText style={{color: colors.secondary}}>
              oder Wallet mit Seed Phrase wiederherstellen
            </AppText>
          </Pressable>
        </View>

        <Error error={error} />
        <LoadingModal loading={loading} />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {marginTop: "auto", gap: 16},
  title: {textAlign: "center"},
  image: {width: "100%"},
  input: {
    minHeight: 80,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  subtitle: {marginTop: 16},
});

export default LoginScreen;
