import React from "react";
import {Animated, ImageBackground, StyleSheet} from "react-native";

interface Props {
  initiated: boolean;
  removeSplashScreen: () => void;
}

const LOADING_IMAGE = "Loading image";
const FADE_IN_IMAGE = "Fade in image";
const WAIT_FOR_APP_TO_BE_READY = "Wait for app to be ready";
const FADE_OUT = "Fade out";
const HIDDEN = "Hidden";
const ANIMATION_DURATION = 750;

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

const SplashScreen: React.FC<Props> = ({initiated, removeSplashScreen}) => {
  const [state, setState] = React.useState(LOADING_IMAGE);

  const containerOpacity = React.useRef(new Animated.Value(1)).current;
  const imageOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (state === FADE_IN_IMAGE) {
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(() => setState(WAIT_FOR_APP_TO_BE_READY));
    }
  }, [imageOpacity, state]);

  React.useEffect(() => {
    if (state === WAIT_FOR_APP_TO_BE_READY && initiated) setState(FADE_OUT);
    else if (state === HIDDEN && initiated) removeSplashScreen();
  }, [initiated, state]);

  React.useEffect(() => {
    if (state === FADE_OUT) {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(() => setState(HIDDEN));
    }
  }, [containerOpacity, state]);

  if (state === HIDDEN) return null;

  return (
    <Animated.View
      style={[styles.container, {opacity: containerOpacity}]}
      id="splash">
      <AnimatedImageBackground
        source={require("../../assets/splash.png")}
        onLoad={() => setState(FADE_IN_IMAGE)}
        style={[styles.image, {opacity: imageOpacity}]}
        resizeMode="cover"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {flex: 1, width: "100%"},
});

export default SplashScreen;
