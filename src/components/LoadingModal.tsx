import React from "react";
import {Modal, StyleSheet, View} from "react-native";
import Loading from "./Loading";

interface Props {
  text?: string;
  loading: boolean;
  testID?: string;
}

const LoadingModal: React.FC<Props> = ({loading, testID, text = "Loading"}) => (
  <Modal animationType="fade" visible={loading} transparent>
    <View style={styles.overlay} />
    <View style={styles.outerContainer}>
      <Loading testID={testID} style={styles.modal} text={text} />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {flex: 1, opacity: 0.4, backgroundColor: "#b1b1b1"},
  outerContainer: {
    flex: 1,
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#fff",
    boxShadow: [
      {
        offsetX: 5,
        offsetY: 5,
        blurRadius: 5,
        spreadDistance: 0,
        color: "rgba(255, 0, 0, 0.5)",
      },
    ],
  },
});

export default LoadingModal;
