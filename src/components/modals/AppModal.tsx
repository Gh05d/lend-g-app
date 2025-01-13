import React from "react";
import {
  Modal,
  ModalBaseProps,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import {useTheme} from "@react-navigation/native";

import {basicModalStyles, boxShadow} from "../../common/variables";

interface Props extends ModalBaseProps {
  show: boolean;
  close?: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const AppModal: React.FC<Props> = props => {
  const {show, close, style, children, ...modalProps} = props;
  const {colors} = useTheme();

  return (
    <Modal
      onRequestClose={close}
      transparent
      visible={show}
      animationType="slide"
      {...modalProps}>
      <Pressable style={styles.modalContainer} onPress={close}>
        <View
          style={[
            basicModalStyles,
            {backgroundColor: colors.card, boxShadow},
            style,
          ]}>
          {children}
        </View>
      </Pressable>
    </Modal>
  );
};

export default AppModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
