import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { FoodData } from "../context/ScannedFoodContext";

const foodCardPicture = require("../assets/images/foodCardPicture.webp");

type FoodCardProps = {
  food: FoodData;
  onDelete: () => void;
};

export default function FoodCard({ food, onDelete }: FoodCardProps) {
  const [grams, setGrams] = useState("100");

  const gramsNumber = Number(grams.replace(",", ".")) || 0;

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
            Calories: {((Number(food.kcal) * gramsNumber) / 100).toFixed(1)}{" "}
            kcal,
          </Text>
          <Text style={styles.nutrientText}>
            Protein: {((Number(food.protein) * gramsNumber) / 100).toFixed(1)}{" "}
            g,
          </Text>
          <Text style={styles.nutrientText}>
            Carbs: {((Number(food.carbs) * gramsNumber) / 100).toFixed(1)} g,
          </Text>
          <Text style={styles.nutrientText}>
            Fats: {((Number(food.fat) * gramsNumber) / 100).toFixed(1)} g
          </Text>
          <Text style={styles.nutrientText}>
            Grams: {((Number(food.grams) * gramsNumber) / 100).toFixed(1)} g
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
