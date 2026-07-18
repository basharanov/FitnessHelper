import { Stack, router } from "expo-router";
import { Pressable, Text } from "react-native";

export default function ActivitiesLayout() {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/foodDiary");
  };

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: "slide_from_right",
        headerLeft: () => (
          <Pressable
            onPress={handleBack}
            hitSlop={12}
            style={{
              paddingRight: 16,
            }}
          >
            <Text
              style={{
                fontSize: 32,
                lineHeight: 32,
              }}
            >
              ‹
            </Text>
          </Pressable>
        ),
      }}
    >
      <Stack.Screen name="add-activity" />

      <Stack.Screen name="create-activity" />
    </Stack>
  );
}
