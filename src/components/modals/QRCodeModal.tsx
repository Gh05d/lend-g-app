import React from "react";
import {Image, Modal, Pressable, StyleSheet, View} from "react-native";
import {useTheme} from "@react-navigation/native";

import AppText from "../AppText";
import AppButton from "../AppButton";

interface Props {
  show: boolean;
  close: () => void;
  qrCodeValue: string;
}

const QRCodeModal: React.FC<Props> = ({show, qrCodeValue, close}) => {
  const {colors} = useTheme();

  return (
    <Modal
      visible={show}
      transparent
      animationType="slide"
      onRequestClose={close}>
      <Pressable style={styles.modalContainer} onPress={close}>
        <View
          style={[styles.modalContent, {backgroundColor: colors.card}]}
          onStartShouldSetResponder={() => true}>
          {qrCodeValue ? (
            <Image
              source={{
                uri: `https://api.qrserver.com/v1/create-qr-code/?data=transaction-${qrCodeValue}&size=150x150`,
              }}
              style={{width: 150, height: 150}}
            />
          ) : (
            <AppText>QR-Code konnte nicht generiert werden.</AppText>
          )}

          <AppButton title="Schließen" onPress={close} color={colors.error} />
        </View>
      </Pressable>
    </Modal>
  );
};

export default QRCodeModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    paddingHorizontal: 48,
    paddingVertical: 24,
    borderRadius: 8,
    gap: 32,
    alignItems: "center",
    boxShadow: "0 0 4px rgba(0, 0, 0, 0.6)",
  },
});
