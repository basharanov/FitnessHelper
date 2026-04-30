import React from "react";
import { View, Text, StyleSheet } from "react-native";

type FoodData = {
  name: string;
  protein: number | string;
  carbohydrates: number | string;
  fat: number | string;
  kcal: number | string;
  sugar: number | string;
  salt: number | string;
};

type FoodCardProps = {
  food: FoodData;
};

export default function FoodCard({ food }: FoodCardProps) {
  return (
    <View>
      <Text style={styles.text}>{food.name}</Text>
      <Text style={styles.text}>{food.kcal} kcal</Text>
      <Text style={styles.text}>{food.protein}g protein</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: { marginTop: 8, fontSize: 16, color: "#ffffff", textAlign: "center" },
});
