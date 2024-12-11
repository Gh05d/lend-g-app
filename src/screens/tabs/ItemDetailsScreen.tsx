import React, {useEffect, useState} from "react";
import {StyleSheet} from "react-native";
import {useTheme} from "@react-navigation/native";
import axios from "axios";
import type {StackScreenProps} from "@react-navigation/stack";

import ScreenWrapper from "../../components/ScreenWrapper";
import AppText from "../../components/AppText";
import Error from "../../components/Error";
import Loading from "../../components/Loading";

type Props = StackScreenProps<StackParamList, "ItemDetails">;

const ItemDetailsScreen: React.FC<Props> = ({route}) => {
  const {id, userID} = route.params;
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);

  const {colors} = useTheme();

  useEffect(() => {
    (async function fetchItem() {
      try {
        const {data} = await axios.get<Item>(
          `http://my-json-server.typicode.com/Gh05d/lend-g-app/items/${id}`,
        );

        const {data: d2} = await axios(`https://dummyjson.com/users/${userID}`);

        console.log(d2);

        setItem(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loading text="Lade Angebote" />;
  if (error) return <Error fullScreen error={error} />;

  return (
    <ScreenWrapper>
      <AppText bold style={styles.title}>
        {item!.title}
      </AppText>
      <AppText style={styles.category}>{item!.category}</AppText>
      <AppText bold style={[styles.price, {color: colors.primary}]}>
        {item!.price}
      </AppText>
      <AppText style={styles.description}>
        Description: {item!.description}
      </AppText>
    </ScreenWrapper>
  );
};

export default ItemDetailsScreen;

const styles = StyleSheet.create({
  title: {fontSize: 24, marginBottom: 8},
  category: {fontSize: 18, marginBottom: 8},
  price: {fontSize: 20, marginBottom: 16},
  description: {fontSize: 16},
  errorText: {fontSize: 18, textAlign: "center"},
});
