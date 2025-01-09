import React, {useState} from "react";
import {StyleSheet} from "react-native";
import {Connection, clusterApiUrl} from "@solana/web3.js";
import {MobileWalletAdapter} from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import ScreenWrapper from "../../components/ScreenWrapper";
import AppText from "../../components/AppText";
import AppButton from "../../components/AppButton";

const WalletLoginScreen = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleConnectWallet = async () => {
    try {
      const adapter = new MobileWalletAdapter();
      const connection = new Connection(clusterApiUrl("devnet"));

      const [publicKey] = await adapter.connect();
      setWalletAddress(publicKey.toBase58());

      console.log("Connected to wallet:", publicKey.toBase58());
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return (
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
      <AppText>
        Wallet-Adresse: {walletAddress || "Noch nicht verbunden"}
      </AppText>
      <AppButton title="Mit Wallet verbinden" onPress={handleConnectWallet} />
    </ScreenWrapper>
  );
};

export default WalletLoginScreen;

const styles = StyleSheet.create({
  title: {textAlign: "center", marginBottom: 24},
});
