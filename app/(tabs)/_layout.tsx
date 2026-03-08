import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "green",
          tabBarStyle: {
            backgroundColor: "#252625",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerTitle: "Fitness Helper",
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={"home"}
                color={focused ? "green" : "white"}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="foodDiary"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={"fast-food"}
                color={focused ? "green" : "white"}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="exerciseDiary"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={"barbell"}
                color={focused ? "green" : "white"}
                size={24}
              />
            ),
          }}
        />
      </Tabs>
      ;
    </>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#252625",
  },
  icon: {
    color: "white",
    fontSize: 24,
  },
});
