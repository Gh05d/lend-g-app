import React, {useEffect, useState} from "react";
import {useColorScheme} from "react-native";
import SplashScreen from "./components/Splash";
import {NavigationContainer} from "@react-navigation/native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import axios from "axios";
import "./common/mirageJSSetup";

import RootNavigator from "./common/Navigators";
import {CustomDarkTheme, CustomLightTheme} from "./themes";
import {UserContext} from "./common/variables";

const App: React.FC = () => {
  const [initiated, setInitiated] = React.useState(false);
  const [show, toggle] = React.useState(true);

  const [user, setUser] = useState<null | User>(null);

  const scheme = useColorScheme();

  useEffect(() => {
    (async function fetchUser() {
      try {
        const {data} = await axios.get<{users: User[]}>("/api/users");

        setUser(data.users[0]);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setInitiated(true);
      }
    })();
  }, []);

  if (show) {
    return (
      <SplashScreen
        initiated={initiated}
        removeSplashScreen={() => toggle(false)}
      />
    );
  }

  return (
    <UserContext.Provider value={user}>
      <SafeAreaProvider>
        <NavigationContainer
          theme={scheme === "dark" ? CustomDarkTheme : CustomLightTheme}>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </UserContext.Provider>
  );
};

export default App;
