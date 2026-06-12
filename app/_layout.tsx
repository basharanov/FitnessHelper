import { Stack } from "expo-router";
import { ScannedFoodProvider } from "../context/ScannedFoodContext";

export default function RootLayout() {
  return (
    <ScannedFoodProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerTitle: "Fitness Helper",
            headerShown: false,
          }}
        />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        <Stack.Screen name="barcode-scan" options={{ headerShown: true }} />
      </Stack>
    </ScannedFoodProvider>
  );
}
