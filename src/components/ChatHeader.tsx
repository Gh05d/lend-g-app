import React from "react";
import {StyleSheet, View} from "react-native";

interface Props {
  title: string;
}

const ChatHeader: React.FC<Props> = props => {
  console.log("-->", props);
  return <View style={styles.root}></View>;
};

export default ChatHeader;

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: "#fff"},
});
