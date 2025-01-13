import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Linking, useColorScheme} from "react-native";
import SplashScreen from "./components/Splash";
import {NavigationContainer} from "@react-navigation/native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import "./common/mirageJSSetup";

import NewUserModal from "./components/modals/NewUserModal";
import RootNavigator from "./common/Navigators";
import {CustomDarkTheme, CustomLightTheme} from "./themes";
import {navigationRef, UserContext} from "./common/variables";

// NOTE: Does not work
const linking = {
  prefixes: ["lendg://"],
  config: {
    screens: {
      ManageItemsStack: {screens: {ManageItems: "transaction/:requestID"}},
      HomeStack: {path: "*"},
    },
  },
};

const App: React.FC = () => {
  const [showNewUserModal, setNewUserModal] = useState(false);
  const [initiated, setInitiated] = useState(false);
  const [show, toggle] = useState(true);
  const [user, setUser] = useState<null | User>(null);

  const scheme = useColorScheme();

  function parseQueryParams(url: string): {[key: string]: string} {
    const queryString = url.split("?")[1];
    if (!queryString) return {};

    return queryString
      .split("&")
      .reduce((params: {[key: string]: string}, param) => {
        const [key, value] = param.split("=");
        params[key] = decodeURIComponent(value);
        return params;
      }, {});
  }

  const handleQRCode = useCallback(
    async (queryParams: {[key: string]: string}) => {
      const {requestID} = queryParams;

      if (!requestID) return console.warn("Missing request id.");

      if (navigationRef.isReady()) {
        navigationRef.navigate("ManageItemsStack", {
          name: "ManageItems",
          params: {requestID},
        });
      } else {
        console.warn("Navigation is not ready yet.");
        setTimeout(() => handleQRCode(queryParams), 1000);
      }
    },
    [],
  );

  useEffect(() => {
    if (user && !user.userName) setNewUserModal(true);
    setInitiated(true);
  }, [user?.userName, user]);

  // Gets called if the App is running or in the background
  useEffect(() => {
    async function handleDeepLink(event: {url: string}) {
      await handleQRCode(parseQueryParams(event.url));
    }

    Linking.addEventListener("url", handleDeepLink);

    return () => {
      Linking.removeAllListeners("url");
    };
  }, [handleQRCode]);

  // Gets called if the App was closed
  useEffect(() => {
    (async function getUrlAsync() {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (!initialUrl) return;

        const queryParams = parseQueryParams(initialUrl);
        await handleQRCode(queryParams);
      } catch (error) {
        console.error("Failed to handle deep link:", error);
      }
    })();
  }, [handleQRCode]);

  const userContext = useMemo(() => ({user, setUser}), [user]);

  if (show) {
    return (
      <SplashScreen
        initiated={initiated}
        removeSplashScreen={() => toggle(false)}
      />
    );
  }

  return (
    <UserContext.Provider value={userContext}>
      <SafeAreaProvider>
        <NavigationContainer
          linking={linking}
          ref={navigationRef}
          theme={scheme === "dark" ? CustomDarkTheme : CustomLightTheme}>
          <RootNavigator />

          <NewUserModal
            show={showNewUserModal}
            close={() => setNewUserModal(false)}
          />
        </NavigationContainer>
      </SafeAreaProvider>
    </UserContext.Provider>
  );
};

export default App;
