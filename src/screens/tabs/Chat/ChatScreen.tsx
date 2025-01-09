import React, {useEffect, useState} from "react";
import {FlatList, StyleSheet, View, TextInput, Keyboard} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {useTheme} from "@react-navigation/native";
import dayjs from "dayjs";
import axios from "axios";

import AppText from "../../../components/AppText";
import ScreenWrapper from "../../../components/ScreenWrapper";
import AppButton from "../../../components/AppButton";

interface ChatMessages extends Chat {
  messages: Message[];
}

type Props = StackScreenProps<ChatStackParamList, "Chat">;

const UserChatScreen: React.FC<Props> = ({route}) => {
  const {chatID} = route.params as {chatID: string};
  const [chat, setChat] = useState<ChatMessages | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {colors} = useTheme();

  useEffect(() => {
    const fetchChat = async () => {
      try {
        await axios.patch(`/api/messages/read`, {chatID});

        const {data} = await axios.get<{chat: Chat}>(`api/chats/${chatID}`);
        const res = await axios.get<{messages: Message[]}>(
          `api/messages/${chatID}`,
        );

        if (data.chat) setChat({...data.chat, messages: res.data.messages});
        else throw new Error("Chat not found");
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [chatID]);

  async function handleSendMessage() {
    if (!newMessage.trim()) return;

    const data: Message = {
      ownerID: chat?.ownerID!,
      chatID,
      text: newMessage,
      timestamp: new Date(),
    };

    const {data: newMsg} = await axios.post("/api/messages", {data});

    setChat(prevChat => {
      if (!prevChat) return null;
      return {
        ...prevChat,
        messages: [
          ...prevChat.messages,
          {...newMsg.message.data, id: newMsg.message.id},
        ],
      };
    });
    setNewMessage("");
    Keyboard.dismiss();
  }

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
      <AppText style={{color: colors.text}}>{item.text}</AppText>
      <AppText style={styles.timestamp}>
        {dayjs(item.timestamp).locale("de").fromNow()} {item.read ? "✔✔" : "✔"}
      </AppText>
    </View>
  );

  return (
    <ScreenWrapper loading={loading} error={error}>
      <FlatList
        data={chat?.messages}
        keyExtractor={item => item.id}
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
          multiline
          onSubmitEditing={handleSendMessage}
        />
        <AppButton
          disabled={!newMessage}
          title="Senden"
          onPress={handleSendMessage}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  messagesContainer: {padding: 16},
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
