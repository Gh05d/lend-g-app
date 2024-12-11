import React from "react";
import {Button, ButtonProps} from "react-native";
import {useTheme} from "@react-navigation/native";

const AppButton: React.FC<ButtonProps> = props => {
  const {colors} = useTheme();

  return <Button color={colors.primary} {...props} />;
};

export default AppButton;
