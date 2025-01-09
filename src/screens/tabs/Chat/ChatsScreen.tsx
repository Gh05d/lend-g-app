import React, {useState, useEffect, useCallback, useContext} from "react";
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
import {UserContext} from "../../../common/variables";

type Props = CompositeScreenProps<
  StackScreenProps<ChatStackParamList, "Chats">,
  BottomTabScreenProps<TabParamList, "ChatsStack">
>;

const ChatsScreen: React.FC<Props> = ({navigation}) => {
  const {colors} = useTheme();
  const [chats, setChats] = useState<ChatPreview[]>();
  const [users, setUsers] = useState<Record<string, User>>({});
  const [error, setError] = React.useState<null | Error>(null);
  const [loading, setLoading] = React.useState(true);

  const user = useContext(UserContext);

  useEffect(() => {
    (async function init() {
      try {
        const {data} = await axios.get<ChatPreview[]>(
          `api/chats/user/${user?.id}`,
        );

        const userIDs = new Set();

        data.forEach(({ownerID, userID}) => {
          if (userID != user?.id) userIDs.add(userID);
          if (ownerID != user?.id) userIDs.add(ownerID);
        });

        const responses = await axios.get<{users: User[]}>(`/api/users/bulk`, {
          params: {userIDs: [...userIDs].join(",")},
        });

        const usersData = responses.data.users.reduce<Record<string, User>>(
          (acc, cV) => {
            acc[cV.id] = {...cV};
            return acc;
          },
          {},
        );

        setChats(data);
        setUsers(usersData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  const renderChatCard = useCallback(
    ({item}: {item: ChatPreview}) => {
      const hasUnreadMessages = !item.lastMessage?.read;

      const lastTimestamp = dayjs(item.lastMessage?.timestamp).locale("de");
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
              userName: users[item.userID]?.userName,
              profilePicture: users[item.userID].userName,
            });
          }}>
          <View style={styles.row}>
            <Image
              source={{uri: users[item.userID]?.profilePicture}}
              style={[styles.avatar, {backgroundColor: colors.background}]}
            />
            <View style={styles.contentContainer}>
              <AppText bold textSize="large">
                {users[item.userID]?.userName || "Laden..."}
              </AppText>

              <AppText
                style={{color: "#aaa"}}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.lastMessage?.text?.trim() || "Keine Nachricht"}
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
    <ScreenWrapper loading={loading} error={error}>
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
  contentContainer: {height: 44, flex: 1, justifyContent: "space-between"},
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
