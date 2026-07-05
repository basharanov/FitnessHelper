import { Stack } from "expo-router";
import { useAuthStore } from "../context/authStore";
import { ScannedFoodProvider } from "../context/ScannedFoodContext";

export default function RootLayout() {
  const { isLoggedIn } = useAuthStore();
  return (
    <ScannedFoodProvider>
      <Stack>
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerTitle: "Fitness Helper",
              headerShown: false,
            }}
          />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          <Stack.Screen name="barcode-scan" options={{ headerShown: true }} />
        </Stack.Protected>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </ScannedFoodProvider>
  );
}
