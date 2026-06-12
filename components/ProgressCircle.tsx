import { Circle } from "react-native-progress";
import React from "react";
import { FoodData } from "../context/ScannedFoodContext";

type Props = {
  progressValue: number;
  size: number;
};

function colorCalculation(value: number) {
  if (value <= 0.2) {
    return "red";
  }
  if (value <= 0.4) {
    return "orange";
  }
  if (value <= 0.6) {
    return "yellow";
  }
  if (value <= 0.8) {
    return "lightgreen";
  }
  if (value <= 1.2) {
    return "green";
  }
  if (value <= 1.4) {
    return "lightgreen";
  }
  if (value <= 1.6) {
    return "yellow";
  }
  if (value <= 1.8) {
    return "orange";
  }
  if (value > 1.8) {
    return "red";
  }
}

function progressValidation(value: any) {
  const num = parseFloat(value) / 100;
  if (isNaN(num)) {
    return 0;
  }
  return num;
}

export default function ProgressCircle({ progressValue, size }: Props) {
  const progress = progressValidation(progressValue);
  return (
    <Circle
      progress={progress}
      size={size}
      color={colorCalculation(progress)}
      borderColor="none"
      thickness={8}
      strokeCap="round"
      showsText={true}
      unfilledColor="#555555"
    />
  );
}
