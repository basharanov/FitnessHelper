import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerTitle: "Fitness Helper",
            headerShown: false,
          }}
        />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        <Stack.Screen name="barcode-scanner" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
