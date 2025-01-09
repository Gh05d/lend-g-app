import React, {useCallback, useContext, useEffect, useState} from "react";
import {View, StyleSheet, SectionList} from "react-native";
import {useTheme} from "@react-navigation/native";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import axios from "axios";

import ScreenWrapper from "../../components/ScreenWrapper";
import AppText from "../../components/AppText";
import AppButton from "../../components/AppButton";
import QRCodeModal from "../../components/modals/QRCodeModal";

import {UserContext} from "../../common/variables";

type Props = BottomTabScreenProps<TabParamList, "QRCodes">;

const QRCodeScreen: React.FC<Props> = ({}) => {
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const user = useContext(UserContext);
  const {colors} = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) return;

        const lentItems = await axios.get<Item[]>(
          `/api/items/rentedFrom/${user?.id}`,
        );
        const acceptedRequests = await axios.get<Request[]>(
          `/api/requests/user`,
          {params: {status: "accepted", ownerID: user?.id}},
        );

        setSections([
          {title: "Verliehene Artikel", data: lentItems.data},
          {title: "Angenommene Anfragen", data: acceptedRequests.data},
        ]);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleQRCode = (request: FullRequest) => {
    setQrCodeValue(
      `myapp://transaction?itemID=${request.item.id}&requestID=${request.id}&userID=${request.item.userID}`,
    );
    setModalVisible(true);
  };

  const renderItem = useCallback(
    ({item}: {item: any}) => (
      <View style={[styles.itemContainer, {backgroundColor: colors.card}]}>
        <AppText textSize="large" bold>
          {item.item.title}
        </AppText>
        <AppText>{item.item.description}</AppText>
        <AppButton
          title="QR-Code anzeigen"
          onPress={() => handleQRCode(item)}
          color={colors.primary}
        />
      </View>
    ),
    [colors.card, colors.primary],
  );

  return (
    <ScreenWrapper loading={loading} error={error}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        renderSectionHeader={({section}) => (
          <AppText bold textSize="heading" style={styles.sectionHeader}>
            {section.title}
          </AppText>
        )}
        contentContainerStyle={styles.listContainer}
      />

      <QRCodeModal
        show={modalVisible}
        close={() => setModalVisible(false)}
        qrCodeValue={qrCodeValue!}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  listContainer: {padding: 16},
  sectionHeader: {marginVertical: 12},
  itemContainer: {padding: 16, gap: 12, borderRadius: 8, marginBottom: 24},
});

export default QRCodeScreen;
