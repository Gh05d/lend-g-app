import React, {useState, useContext} from "react";
import {
  Appearance,
  View,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Image,
} from "react-native";
import {useTheme} from "@react-navigation/native";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Dropdown from "../../components/AppDropdown";
import ScreenWrapper from "../../components/ScreenWrapper";
import AppText from "../../components/AppText";
import AppButton from "../../components/AppButton";
import {THEME, UserContext} from "../../common/variables";

type Props = BottomTabScreenProps<TabParamList, "Profile">;

const ProfileScreen: React.FC<Props> = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {colors} = useTheme();
  const scheme = useColorScheme();

  const [colorScheme, setColorScheme] = useState(scheme || "light");
  const user = useContext(UserContext);

  const handleChange = (selectedValue: string) => setColorScheme(selectedValue);

  function formatLabel(key: string) {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^[a-z]/, c => c.toUpperCase());
  }

  const renderField = (key: string, value: any) => {
    switch (key) {
      case "password":
      case "id":
        return null;

      case "profilePicture":
        return (
          <Image
            key={key}
            source={{uri: value}}
            style={{width: 200, height: 200, borderRadius: 400}}
          />
        );

      default: {
        if (typeof value === "object" && value) {
          return (
            <View key={key} style={{marginLeft: 16}}>
              <AppText bold>{formatLabel(key)}:</AppText>
              {Object.entries(value).map(([nestedKey, nestedValue]) =>
                renderField(nestedKey, nestedValue),
              )}
            </View>
          );
        }

        return (
          <AppText key={key}>
            {formatLabel(key)}: {value}
          </AppText>
        );
      }
    }
  };

  return (
    <ScreenWrapper style={{gap: 12}} loading={loading} error={error}>
      <ScrollView contentContainerStyle={{gap: 12}}>
        <AppText bold style={[styles.header, {color: colors.text}]}>
          Einstellungen
        </AppText>

        <AppText style={{color: colors.text, marginBottom: 12}}>
          Theme auswählen:
        </AppText>
        <Dropdown
          value={colorScheme}
          items={[
            {label: "System", value: "system"},
            {label: "Hell", value: "light"},
            {label: "Dunkel", value: "dark"},
          ]}
          onChange={handleChange}
        />

        <AppButton
          onPress={() => {
            Appearance.setColorScheme(colorScheme);
            AsyncStorage.setItem(THEME, colorScheme);
          }}
          title="Update Theme"
        />

        <AppText bold style={[styles.header, {color: colors.text}]}>
          Deine Daten
        </AppText>

        {user &&
          Object.entries(user).map(([key, value]) => renderField(key, value))}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {fontSize: 24, lineHeight: 24, marginVertical: 16},
});

export default ProfileScreen;
