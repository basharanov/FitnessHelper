import SelectedDatePicker from "@/components/SelectedDatePicker";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: true,
          header: () => <SelectedDatePicker />,
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
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={"barbell"}
                color={focused ? "green" : "white"}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused, color }) => (
              <AntDesign
                name="profile"
                size={24}
                color={focused ? "green" : "white"}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
