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
import AppInput from "../../components/AppInput";
import UpdateEmailModal from "../../components/modals/UpdateEmailModal";

import {THEME, UserContext} from "../../common/variables";

type Props = BottomTabScreenProps<TabParamList, "Profile">;

const ProfileScreen: React.FC<Props> = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<Record<string, string>>({});
  const [showEmail, toggleEmail] = React.useState(false);

  const {colors} = useTheme();
  const scheme = useColorScheme();

  const [colorScheme, setColorScheme] = useState(scheme || "light");
  const {user, setUser} = useContext(UserContext);

  const handleChange = (selectedValue: string) => setColorScheme(selectedValue);

  function formatLabel(key: string) {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^[a-z]/, c => c.toUpperCase());
  }

  const renderField = (key: string, value: any) => {
    if (isEditing) {
      switch (key) {
        case "id":
        case "walletAddress":
        case "profilePicture":
        case "birthDate":
          return null;

        default:
          return (
            <AppInput
              key={key}
              label={formatLabel(key)}
              style={[styles.input, {color: colors.text}]}
              placeholder={formatLabel(key)}
              value={updatedUser[key] || value}
              onChangeText={text =>
                setUpdatedUser(prev => ({...prev, [key]: text}))
              }
            />
          );
      }
    }

    switch (key) {
      case "id":
      case "walletAddress":
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
    <ScreenWrapper style={{gap: 12}} loading={false} error={null}>
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

        {!isEditing ? (
          <>
            <AppButton
              title="Profil editieren"
              onPress={() => setIsEditing(true)}
            />

            <AppButton
              outline
              title="Email aktualisieren"
              onPress={() => toggleEmail(true)}
            />
          </>
        ) : (
          <>
            <AppButton
              title="Änderungen speichern"
              onPress={() => {
                setUser({...user, ...updatedUser});
                setIsEditing(false);
              }}
            />
            <AppButton
              outline
              title="Abbrechen"
              onPress={() => setIsEditing(false)}
            />
          </>
        )}

        <UpdateEmailModal
          show={showEmail}
          close={() => toggleEmail(false)}
          currentEmail={user?.email!}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {fontSize: 24, lineHeight: 24, marginVertical: 16},
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default ProfileScreen;
