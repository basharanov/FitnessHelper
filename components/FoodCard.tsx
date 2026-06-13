import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { FoodData } from "../context/ScannedFoodContext";
import { Button } from "@react-navigation/elements";

const foodCardPicture = require("../assets/images/foodCardPicture.webp");

type FoodCardProps = {
  food: FoodData;
  onDelete: () => void;
};

export default function FoodCard({ food, onDelete }: FoodCardProps) {
  const [grams, setGrams] = useState("100");

  const gramsNumber = Number(grams.replace(",", ".")) || 0;

  const calculateValue = (value: number | string) => {
    if (typeof value !== "number") {
      return "Unknown";
    }

    const result = (value * gramsNumber) / 100;
    return Number(result.toFixed(1));
  };

  return (
    <View style={styles.card}>
      <Image source={foodCardPicture} style={styles.image} />
      <View style={styles.textArea}>
        <Text style={styles.foodName}>{food.name}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 5,
            flexWrap: "wrap",
          }}
        >
          <Text style={styles.nutrientText}>
            Calories: {calculateValue(food.kcal)} kcal,
          </Text>
          <Text style={styles.nutrientText}>
            Protein: {calculateValue(food.protein)} g,
          </Text>
          <Text style={styles.nutrientText}>
            Carbs: {calculateValue(food.carbohydrates)} g,
          </Text>
          <Text style={styles.nutrientText}>
            Fat: {calculateValue(food.fat)} g
          </Text>
          <Text style={styles.nutrientText}>
            Grams: {calculateValue(food.grams)} g
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    backgroundColor: "#25a846",
    padding: 8,
    width: 380,
    height: 80,
    borderColor: "#ffffff",
    borderWidth: 2,
    marginBottom: 5,
    flexDirection: "row",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: "#ffffff",
    borderWidth: 2,
  },
  textArea: {
    color: "#fff",
    height: 40,
    width: 100,
    paddingHorizontal: 10,
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
    marginTop: 5,
  },
  foodName: {
    fontSize: 12,
    fontWeight: "bold",
  },
  nutrientText: {
    fontSize: 10,
    marginHorizontal: 2,
  },
});
