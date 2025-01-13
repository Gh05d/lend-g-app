import React, {useContext, useRef, useState} from "react";
import {TextInput, useWindowDimensions} from "react-native";
import axios from "axios";

import AppInput from "../AppInput";
import AppModal from "./AppModal";
import AppText from "../AppText";

import {UserContext} from "../../common/variables";
import AppButton from "../AppButton";
import Error from "../Error";

interface Props {
  show: boolean;
  close: () => void;
}

const NewUserModal: React.FC<Props> = props => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  const {width, height} = useWindowDimensions();
  const {user, setUser} = useContext(UserContext);
  const ref = useRef<null | TextInput>(null);

  async function handleSubmit() {
    try {
      await setLoading(true);
      const {data} = await axios.patch<{user: User}>("/api/init-user", {
        id: user?.id,
        userName,
        email,
      });
      setUser(data.user);
      props.close();
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppModal
      style={{width: width * 0.8, height: height * 0.3}}
      show={props.show}>
      <AppText textSize="large">Herzlich Willkommen bei LendG</AppText>
      <AppInput
        label="Bitte wähle einen Nutzernamen:"
        value={userName}
        placeholder="Nutzernamen eingeben"
        onChangeText={setUserName}
        onSubmitEditing={() => ref.current?.focus()}
        blurOnSubmit={false}
      />

      <AppInput
        ref={ref}
        label="Hinterlege deine Email:"
        value={email}
        placeholder="Email eingeben"
        onChangeText={setEmail}
        onSubmitEditing={handleSubmit}
        returnKeyType="send"
      />
      <Error error={error} />

      <AppButton
        disabled={loading || userName.length < 2}
        loading={loading}
        onPress={handleSubmit}
        title="Nutzernamen setzen"
      />
    </AppModal>
  );
};

export default NewUserModal;
