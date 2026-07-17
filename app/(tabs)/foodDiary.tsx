import { useDateStore } from "@/context/dateStore";
import { getFetch } from "@/fetchHelper/baseFetch";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import FoodCard from "../../components/FoodCard";
import ProgressCircle from "../../components/ProgressCircle";
import useScannedFoodContext, {
  FoodData,
} from "../../context/ScannedFoodContext";

export default function FoodDiaryScreen() {
  const [targetCalories, onChangeTargetCalories] = React.useState(2000);
  const [targetProtein, onChangeTargetProtein] = React.useState(150);
  const [targetCarbs, onChangeTargetCarbs] = React.useState(250);
  const [targetFat, onChangeTargetFat] = React.useState(70);
  const [foodName, onChangeFoodName] = React.useState("");
  const [foodData, setFoodData] = useState<FoodData | null>(null);

  const router = useRouter();
  const params = useLocalSearchParams<{ data?: string }>();
  const { savedFood, calculateTotalValues } = useScannedFoodContext();
  const [logs, setLogs] = useState<any[]>([]);

  const totalValues = calculateTotalValues();
  const selectedDate = useDateStore((state) => state.selectedDate);

  const displayProcent = (
    value: number | string | undefined,
    target: number,
  ) => {
    if (typeof value === "string") return 0;
    if (typeof value === "undefined") return 0;
    return Math.round((value / target) * 100);
  };

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
      <View style={styles.summaryBox}>
        <View style={styles.macroItem}>
          <ProgressCircle
            progressValue={displayProcent(totalValues?.kcal, targetCalories)}
            size={150}
          />
          <Text style={styles.macroText}>
            Calories {totalValues?.kcal} kcal
          </Text>
        </View>
        <View style={styles.macrosContainer}>
          <View style={styles.macroItem}>
            <ProgressCircle
              progressValue={displayProcent(
                totalValues?.protein,
                targetProtein,
              )}
              size={90}
            />
            <Text style={styles.macroText}>
              Protein {totalValues?.protein}g
            </Text>
          </View>

          <View style={styles.macroItem}>
            <ProgressCircle
              progressValue={displayProcent(totalValues?.carbs, targetCarbs)}
              size={90}
            />
            <Text style={styles.macroText}>Carbs {totalValues?.carbs}g</Text>
          </View>

          <View style={styles.macroItem}>
            <ProgressCircle
              progressValue={displayProcent(totalValues?.fat, targetFat)}
              size={90}
            />
            <Text style={styles.macroText}>Fat {totalValues?.fat}g</Text>
          </View>
        </View>
      </View>

      <Button
        title="Barcode scan"
        onPress={() => router.push("/barcode-scan")}
      ></Button>
      <Button
        title="Add food"
        onPress={() => router.push("/search-food")}
      ></Button>
      <Button
        title="Add from custom food"
        onPress={() => router.push("/custom-food")}
      ></Button>
      <Button
        title="Add from recepies"
        onPress={() => router.push("/recipe")}
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
