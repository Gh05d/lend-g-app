import React from "react";
import {StyleSheet, View} from "react-native";

interface Props {}

const HelpScreen: React.FC<Props> = props => {
  return <View style={styles.root}></View>;
};

export default HelpScreen;

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: "#fff"},
});
