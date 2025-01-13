import React, {useContext, useState} from "react";
import {StyleSheet, View} from "react-native";
import AppModal from "./AppModal";
import AppText from "../AppText";
import AppInput from "../AppInput";
import AppButton from "../AppButton";
import axios from "axios";
import Error from "../Error";
import {UserContext} from "../../common/variables";

interface Props {
  show: boolean;
  close: () => void;
  currentEmail: string;
}

const UpdateEmailModal: React.FC<Props> = ({show, close, currentEmail}) => {
  const [email, setEmail] = useState(currentEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const {user, setUser} = useContext(UserContext);

  async function handleSubmit() {
    try {
      await setLoading(true);
      await setError(null);
      const {data} = await axios.patch<{user: User}>("/api/email", {
        email,
        id: user!.id,
      });
      setUser(data.user);
      close();
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppModal
      style={{justifyContent: "flex-start"}}
      show={show}
      close={loading ? undefined : close}>
      <AppText textSize="large">Email aktualisieren</AppText>
      <AppText>
        Wenn du deine Email aktualisierst, schicken wir dir einen
        Bestätigungslink an deine neue Adresse.
      </AppText>
      <AppInput
        label="Email aktualisieren"
        value={email}
        onChangeText={setEmail}
        returnKeyType="send"
        onSubmitEditing={handleSubmit}
      />
      <Error error={error} />

      <View style={{gap: 12}}>
        <AppButton
          loading={loading}
          onPress={handleSubmit}
          title="Email aktualisieren"
        />
        <AppButton
          disabled={loading}
          outline
          onPress={close}
          title="Abbrechen"
        />
      </View>
    </AppModal>
  );
};

export default UpdateEmailModal;

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: "#fff"},
});
