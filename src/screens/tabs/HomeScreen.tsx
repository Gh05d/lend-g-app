import React, {useCallback} from "react";
import {FlatList, Pressable, StyleSheet, TextInput, View} from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import type {CompositeScreenProps} from "@react-navigation/native";
import type {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import type {StackScreenProps} from "@react-navigation/stack";
import type {DrawerScreenProps} from "@react-navigation/drawer";
import {StackParamList, TabParamList, DrawerParamList} from "../../types";
import AppText from "../../components/AppText";
import {useTheme} from "@react-navigation/native";

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Home">,
  CompositeScreenProps<
    StackScreenProps<StackParamList>,
    DrawerScreenProps<DrawerParamList>
  >
>;

const mockData = [
  {id: "1", title: "Camera", category: "Electronics", price: "$10/day"},
  {id: "2", title: "Bike", category: "Vehicles", price: "$15/day"},
  {id: "3", title: "Tent", category: "Camping", price: "$5/day"},
  {id: "4", title: "Laptop", category: "Electronics", price: "$20/day"},
  {id: "5", title: "Drill Machine", category: "Tools", price: "$8/day"},
  {id: "6", title: "Guitar", category: "Music", price: "$12/day"},
  {id: "7", title: "Projector", category: "Electronics", price: "$18/day"},
  {id: "8", title: "Camping Stove", category: "Camping", price: "$7/day"},
  {id: "9", title: "Electric Scooter", category: "Vehicles", price: "$25/day"},
  {id: "10", title: "Tripod", category: "Photography", price: "$4/day"},
  {
    id: "11",
    title: "Gaming Console",
    category: "Electronics",
    price: "$15/day",
  },
  {id: "12", title: "Lawn Mower", category: "Gardening", price: "$10/day"},
  {id: "13", title: "Kayak", category: "Water Sports", price: "$30/day"},
  {id: "14", title: "Snowboard", category: "Winter Sports", price: "$20/day"},
  {id: "15", title: "Barbecue Grill", category: "Outdoor", price: "$12/day"},
  {id: "16", title: "Microscope", category: "Science", price: "$10/day"},
  {id: "17", title: "VR Headset", category: "Gaming", price: "$15/day"},
  {id: "18", title: "Telescope", category: "Science", price: "$20/day"},
  {id: "19", title: "Canoe", category: "Water Sports", price: "$25/day"},
  {id: "20", title: "DJ Equipment", category: "Music", price: "$35/day"},
];

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const {colors} = useTheme();

  const renderItem = useCallback(
    ({item}: {item: (typeof mockData)[0]}) => (
      <Pressable
        style={styles.itemContainer}
        onPress={() => navigation.navigate("ItemDetails")}>
        <AppText style={styles.itemTitle}>{item.title}</AppText>
        <AppText style={styles.itemCategory}>{item.category}</AppText>
        <AppText style={[styles.itemPrice, {color: colors.primary}]}>
          {item.price}
        </AppText>
      </Pressable>
    ),
    [navigation, colors.primary],
  );

  const renderHeader = useCallback(
    () => (
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search items..." />
      </View>
    ),
    [],
  );

  return (
    <ScreenWrapper>
      <FlatList
        data={mockData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContainer, {gap: 16}]}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={{gap: 16}}
        numColumns={2}
      />
    </ScreenWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    marginBottom: 16,
  },
  searchInput: {
    fontSize: 16,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 1,
  },
  listContainer: {paddingHorizontal: 16},
  itemContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 2,
  },
  itemTitle: {fontSize: 18},
  itemCategory: {fontSize: 14, color: "#555"},
  itemPrice: {fontSize: 16},
});
