import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  FlatList,
} from "react-native";
import ProgressCircle from "../../components/ProgressCircle";
import FoodCard from "../../components/FoodCard";

export default function FoodDiaryScreen() {
  type FoodData = {
    barcode: string;
    name: string;
    protein: number | string;
    carbohydrates: number | string;
    fat: number | string;
    kcal: number | string;
    sugar: number | string;
    salt: number | string;
  };
  const [targetCalories, onChangeTargetCalories] = React.useState(2000);
  const [targetProtein, onChangeTargetProtein] = React.useState(150);
  const [targetCarbs, onChangeTargetCarbs] = React.useState(250);
  const [targetFat, onChangeTargetFat] = React.useState(70);
  const [foodName, onChangeFoodName] = React.useState("");
  const [foodData, setFoodData] = useState<FoodData | null>(null);
  const [scanedFoodData, setScanedFoodData] = useState<FoodData[]>([]);

  const router = useRouter();
  const params = useLocalSearchParams<{ data?: string }>();
  const scannedFood = params.data;

  useEffect(() => {
    if (!scannedFood) return;
    const parsedFood: FoodData = JSON.parse(scannedFood);
    setFoodData(parsedFood);
    setScanedFoodData((prev) => [...(prev || []), parsedFood]);
  }, [scannedFood]);

  const displayProcent = (
    value: number | string | undefined,
    target: number,
  ) => {
    if (typeof value === "string") return;
    if (typeof value === "undefined") return;
    return Math.round((value / target) * 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.summaryBox}>
        <View style={styles.macroItem}>
          <ProgressCircle
            progressValue={displayProcent(foodData?.kcal, targetCalories)}
            size={150}
          />
          <Text style={styles.macroText}>Calories {foodData?.kcal} kcal</Text>
        </View>
        <View style={styles.macrosContainer}>
          <View style={styles.macroItem}>
            <ProgressCircle
              progressValue={displayProcent(foodData?.protein, targetProtein)}
              size={90}
            />
            <Text style={styles.macroText}>Protein {foodData?.protein}g</Text>
          </View>

          <View style={styles.macroItem}>
            <ProgressCircle
              progressValue={displayProcent(
                foodData?.carbohydrates,
                targetCarbs,
              )}
              size={90}
            />
            <Text style={styles.macroText}>
              Carbs {foodData?.carbohydrates}g
            </Text>
          </View>

          <View style={styles.macroItem}>
            <ProgressCircle
              progressValue={displayProcent(foodData?.fat, targetFat)}
              size={90}
            />
            <Text style={styles.macroText}>Fat {foodData?.fat}g</Text>
          </View>
        </View>
      </View>

      <Button
        title="Barcode scan"
        onPress={() => router.push("/barcode-scan")}
      ></Button>
      <Text style={styles.macroText}>{foodName}</Text>

      <FlatList
        data={scanedFoodData}
        renderItem={({ item }) => <FoodCard food={item} />}
        keyExtractor={(item) => item.barcode}
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
