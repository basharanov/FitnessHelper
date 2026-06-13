import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
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
  const { barcodeData } = useLocalSearchParams<{
    barcodeData: string;
  }>();
  const foodData = JSON.parse(barcodeData);
  return (
    <>
      <View style={styles.foodNameView}>
        <Text>{foodData.name}</Text>
      </View>
      <View style={styles.textInputView}>
        <Text>Amount in grams:</Text>

        <TextInput
          value={grams}
          onChangeText={handleGramsChange}
          keyboardType="number-pad"
        />
        {gramsError !== "" && (
          <Text style={{ color: "red" }}>{gramsError}</Text>
        )}
      </View>
      <View style={styles.nurtritionView}>
        <Text>
          Calories{" "}
          {foodData.kcal === "Unknown"
            ? "0"
            : foodData.kcal * (Number(grams) / 100)}
        </Text>
        <Text>
          Protein{" "}
          {foodData.protein === "Unknown"
            ? "0"
            : foodData.protein * (Number(grams) / 100)}
        </Text>
        <Text>
          Carbs{" "}
          {foodData.carbohydrates === "Unknown"
            ? "0"
            : foodData.carbohydrates * (Number(grams) / 100)}
        </Text>
        <Text>
          Fat{" "}
          {foodData.fat === "Unknown"
            ? "0"
            : foodData.fat * (Number(grams) / 100)}
        </Text>
        <Text>
          Salt{" "}
          {foodData.salt === "Unknown"
            ? "0"
            : foodData.salt * (Number(grams) / 100)}
        </Text>
        <Text>
          Sugar{" "}
          {foodData.sugar === "Unknown"
            ? "0"
            : foodData.sugar * (Number(grams) / 100)}
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
    </>
  );
}

const styles = StyleSheet.create({
  foodNameView: {
    flex: 1,
    textAlign: "center",
  },
  textInputView: {
    flex: 1,
    textAlign: "center",
  },
  nurtritionView: {
    flex: 1,
    textAlign: "center",
  },
  buttonView: {
    flex: 1,
    textAlign: "center",
  },
});
