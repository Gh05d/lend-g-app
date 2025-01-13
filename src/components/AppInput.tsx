import React, {forwardRef} from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from "react-native";
import AppText from "./AppText";
import {useTheme} from "@react-navigation/native";

interface Props extends TextInputProps {
  style?: StyleProp<TextStyle>;
  label?: string;
}

const AppInput = forwardRef<TextInput, Props>(
  ({style, label, ...props}, ref) => {
    const {colors} = useTheme();

    return (
      <View>
        {label && <AppText style={styles.label}>{label}</AppText>}
        <TextInput
          ref={ref}
          {...props}
          style={[styles.input, style, {color: colors.text}]}
        />
      </View>
    );
  },
);

export default AppInput;

const styles = StyleSheet.create({
  label: {marginBottom: 8},
  input: {
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
});
