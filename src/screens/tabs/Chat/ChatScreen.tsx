import React, {useEffect, useState} from "react";
import {FlatList, StyleSheet, View, TextInput, Image} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {useTheme} from "@react-navigation/native";
import dayjs from "dayjs";
import QRCode from "react-native-qrcode-svg";

import AppText from "../../../components/AppText";
import ScreenWrapper from "../../../components/ScreenWrapper";
import AppButton from "../../../components/AppButton";

import {mockChats} from "../../../common/mockData";

type Props = StackScreenProps<ChatStackParamList, "Chat">;

const UserChatScreen: React.FC<Props> = ({route}) => {
  const {chatID} = route.params as {chatID: string};
  const [chat, setChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {colors} = useTheme();

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const foundChat = mockChats.find(c => c.id === chatID);

        if (foundChat) setChat(foundChat);
        else throw new Error("Chat not found");
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [chatID]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      ownerID: chat?.ownerID!,
      message: newMessage,
      timestamp: new Date(),
    };

    setChat(prevChat => {
      if (!prevChat) return null;
      return {
        ...prevChat,
        messages: [newMsg, ...prevChat.messages],
      };
    });
    setNewMessage("");
  };

  const renderMessage = ({item}: {item: Message}) => (
    <View
      style={[
        styles.message,
        {
          alignSelf: item.ownerID == chat?.ownerID ? "flex-end" : "flex-start",
          backgroundColor:
            item.ownerID == chat?.ownerID ? colors.primary : colors.card,
        },
      ]}>
      <AppText style={{color: colors.text}}>{item.message}</AppText>
      <AppText style={styles.timestamp}>
        {dayjs(item.timestamp).locale("de").fromNow()}
      </AppText>
    </View>
  );

  return (
    <ScreenWrapper loading={loading} error={error}>
      <Image
        source={{
          uri: `https://api.qrserver.com/v1/create-qr-code/?data=transaction-${chatID}&size=150x150`,
        }}
        style={{width: 150, height: 150}}
      />

      <FlatList
        data={chat?.messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Nachricht schreiben..."
          style={[
            styles.input,
            {backgroundColor: colors.card, color: colors.text},
          ]}
        />
        <AppButton title="Senden" onPress={handleSendMessage} />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  messagesContainer: {
    padding: 16,
  },
  message: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: "75%",
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
  },
});

export default UserChatScreen;
