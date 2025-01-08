import React, {useState, useEffect, useCallback} from "react";
import {FlatList, Pressable, StyleSheet, View, Image} from "react-native";
import {CompositeScreenProps, useTheme} from "@react-navigation/native";
import axios from "axios";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {StackScreenProps} from "@react-navigation/stack";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
require("dayjs/locale/de");
dayjs.extend(relativeTime);

import ScreenWrapper from "../../../components/ScreenWrapper";
import AppText from "../../../components/AppText";

type Props = CompositeScreenProps<
  StackScreenProps<ChatStackParamList, "Chats">,
  BottomTabScreenProps<TabParamList, "ChatsStack">
>;

const ChatsScreen: React.FC<Props> = ({navigation}) => {
  const {colors} = useTheme();
  const [chats, setChats] = useState<Chat[]>();
  const [users, setUsers] = useState<Record<string, User>>({});

  useEffect(() => {
    (async function init() {
      try {
        const {data} = await axios.get<{chats: Chat[]}>("api/chats");

        const userIDs = Array.from(
          new Set(data.chats.map(chat => chat.userID)),
        );
        const responses = await Promise.all(
          userIDs.map(id =>
            axios.get<User>(`https://dummyjson.com/users/${id}`),
          ),
        );

        const usersData = responses.reduce<Record<string, User>>((acc, res) => {
          acc[res.data.id] = res.data;
          return acc;
        }, {});

        setChats(data.chats);
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    })();
  }, []);

  const renderChatCard = useCallback(
    ({item}: {item: Chat}) => {
      const hasUnreadMessages = item.messages.some(message => !message.read);

      const lastMessage = item.messages[item.messages.length - 1];
      const lastTimestamp = dayjs(lastMessage.timestamp).locale("de");
      const isToday = lastTimestamp.isSame(dayjs(), "day");
      const displayTime = isToday
        ? lastTimestamp.format("HH:mm")
        : lastTimestamp.fromNow();

      return (
        <Pressable
          style={[styles.card, {backgroundColor: colors.card}]}
          onPress={() => {
            navigation.navigate("Chat", {
              chatID: item.id,
              userName: users[item.userID]?.username,
              profilePicture: users[item.userID].image,
            });
          }}>
          <View style={styles.row}>
            <Image
              source={{uri: users[item.userID]?.image}}
              style={[styles.avatar, {backgroundColor: colors.background}]}
            />
            <View style={styles.contentContainer}>
              <AppText bold style={{fontSize: 16}}>
                {users[item.userID]?.username || "Laden..."}
              </AppText>

              <AppText style={{color: "#aaa"}} numberOfLines={1}>
                {lastMessage.message}
              </AppText>
            </View>

            {hasUnreadMessages && (
              <View
                style={[
                  styles.unreadIndicator,
                  {backgroundColor: colors.primary},
                ]}
              />
            )}
            <AppText style={[styles.timeText, {color: colors.text}]}>
              {displayTime}
            </AppText>
          </View>
        </Pressable>
      );
    },
    [users, colors],
  );

  return (
    <ScreenWrapper loading={Object.keys(users).length === 0} error={null}>
      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={renderChatCard}
        contentContainerStyle={styles.listContainer}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  listContainer: {padding: 16, gap: 12},
  card: {
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {flexDirection: "row", alignItems: "center", gap: 12},
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    position: "relative",
  },
  contentContainer: {flex: 1},
  unreadIndicator: {
    width: 16,
    height: 16,
    borderRadius: 20,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  timeText: {marginLeft: 8, fontSize: 12, alignSelf: "flex-start"},
});

export default ChatsScreen;
