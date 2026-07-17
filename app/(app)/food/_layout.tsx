import { Stack, router } from "expo-router";
import { Pressable, Text } from "react-native";

export default function FoodLayout() {
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
      <Stack.Screen
        name="add-food"
        options={{
          title: "Add food",
        }}
      />

      <Stack.Screen
        name="recipe/recipe"
        options={{
          title: "Recipes",
        }}
      />

      <Stack.Screen
        name="recipe/create-recipe"
        options={{
          title: "Create recipe",
        }}
      />

      <Stack.Screen
        name="customFood/custom-food"
        options={{
          title: "Custom food",
        }}
      />

      <Stack.Screen
        name="customFood/create-custom-food"
        options={{
          title: "Create custom food",
        }}
      />

      <Stack.Screen
        name="normalFood/search-food"
        options={{
          title: "Search food",
        }}
      />
    </Stack>
  );
}
