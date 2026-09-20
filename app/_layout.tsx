import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";


const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    AlfaSlabOne: require("../assets/fonts/AlfaSlabOne-Regular.ttf"),
    Elsie: require("../assets/fonts/Elsie-Regular.ttf"),
    InstrumentSerif: require("../assets/fonts/InstrumentSerif-Regular.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="auto" />

      <Slot />
    </>
  );
};

export default RootLayout;
