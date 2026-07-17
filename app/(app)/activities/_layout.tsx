import { Stack } from "expo-router";

export default function ActivitiesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="add-activity" />

      <Stack.Screen name="create-activity" />
    </Stack>
  );
}
