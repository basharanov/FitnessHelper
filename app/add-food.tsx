import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useScannedFood } from "../context/ScannedFoodContext";

export default function addFood() {
  const [grams, setGrams] = useState("100");
  const [gramsError, setGramsError] = useState("");
  const { addFood } = useScannedFood();

  const handleGramsChange = (text: string) => {
    const isOnlyNumbers = /^[0-9]*$/.test(text);

    if (!isOnlyNumbers) {
      setGramsError("Enter only numbers");
      setGrams("0");
      return;
    }
    setGramsError("");
    setGrams(text);
  };
  const router = useRouter();
  const { foodD } = useLocalSearchParams<{
    foodD: string;
  }>();
  const foodData = JSON.parse(foodD);
  return (
    <View style={styles.container}>
      <View style={styles.foodNameView}>
        <Text style={styles.textContent}>{foodData.name}</Text>
      </View>
      <View style={styles.textInputView}>
        <Text style={styles.textContent}>Amount in grams:</Text>

        <TextInput
          value={grams}
          onChangeText={handleGramsChange}
          keyboardType="number-pad"
          style={styles.textContent}
        />
        {gramsError !== "" && (
          <Text style={{ color: "red" }}>{gramsError}</Text>
        )}
      </View>
      <View style={styles.nurtritionView}>
        <Text style={styles.textContent}>
          Calories{" "}
          {foodData.kcal === "Unknown"
            ? "0"
            : (foodData.kcal * (Number(grams) / 100)).toFixed(2)}
        </Text>
        <Text style={styles.textContent}>
          Protein{" "}
          {foodData.protein === "Unknown"
            ? "0"
            : (foodData.protein * (Number(grams) / 100)).toFixed(2)}
        </Text>
        <Text style={styles.textContent}>
          Carbs{" "}
          {foodData.carbs === "Unknown"
            ? "0"
            : (foodData.carbs * (Number(grams) / 100)).toFixed(2)}
        </Text>
        <Text style={styles.textContent}>
          Fat{" "}
          {foodData.fat === "Unknown"
            ? "0"
            : (foodData.fat * (Number(grams) / 100)).toFixed(1)}
        </Text>
        <Text style={styles.textContent}>
          Salt{" "}
          {foodData.salt === "Unknown"
            ? "0"
            : (foodData.salt * (Number(grams) / 100)).toFixed(2)}
        </Text>
        <Text style={styles.textContent}>
          Sugar{" "}
          {foodData.sugar === "Unknown"
            ? "0"
            : (foodData.sugar * (Number(grams) / 100)).toFixed(1)}
        </Text>
      </View>
      <View style={styles.buttonView}>
        <Button
          title="Add Food"
          onPress={() => {
            foodData.grams = Number(grams);
            addFood(foodData);
            router.replace("/foodDiary");
          }}
        />
        <Button
          title="Cancel"
          onPress={() => {
            router.replace("/foodDiary");
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#252625",
  },
  textContent: {
    fontSize: 20,
    color: "#fff",
  },
  foodNameView: {
    marginBottom: 20,
    textAlign: "center",
  },
  textInputView: {
    textAlign: "center",
    marginBottom: 20,
  },
  nurtritionView: {
    textAlign: "center",
    marginBottom: 20,
  },
  buttonView: {
    textAlign: "center",
    marginBottom: 20,
  },
});
