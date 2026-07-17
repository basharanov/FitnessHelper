import FoodCard from "@/components/FoodCard";
import { useDateStore } from "@/context/dateStore";
import { getFetch } from "@/fetchHelper/baseFetch";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, View } from "react-native";

export default function FoodDiaryScreen() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const selectedDate = useDateStore((state) => state.selectedDate);

  async function getFoodLogsByDate() {
    try {
      const selectDate = selectedDate;
      const year = selectDate.getFullYear();
      const month = String(selectDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectDate.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;

      const data = await getFetch(`/food-logs/${formattedDate}`);
      setLogs(data.logs);
    } catch (error) {
      console.log("Failed fetching food logs:", error);
    }
  }

  useEffect(() => {
    getFoodLogsByDate();
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <Button
        title="Barcode scan"
        onPress={() => router.push("/food/barcode/barcode-scan")}
      ></Button>
      <Button
        title="Add food"
        onPress={() => router.push("/food/normalFood/search-food")}
      ></Button>
      <Button
        title="Add from custom food"
        onPress={() => router.push("/food/customFood/custom-food")}
      ></Button>
      <Button
        title="Add from recepies"
        onPress={() => router.push("/food/recipe/recipe")}
      ></Button>

      <FlatList
        data={logs}
        renderItem={({ item }) => <FoodCard food={item} onDelete={() => {}} />}
        keyExtractor={(item, index) => `${item?.id.toString()}-${index}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#252625",
    paddingTop: 60,
  },
  inputText: {
    color: "#fff",
    borderColor: "#fff",
    borderWidth: 0.5,
    backgroundColor: "#333",
    height: 40,
    width: 100,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  summaryBox: {
    borderWidth: 2,
    borderColor: "#888",
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  macrosContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },

  macroItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  macroText: {
    marginTop: 8,
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
});
