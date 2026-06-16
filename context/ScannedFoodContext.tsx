import { createContext, useContext, useState } from "react";

export type FoodData = {
  id: number;
  barcode: string;
  name: string;
  protein: number | string;
  carbs: number | string;
  fat: number | string;
  kcal: number | string;
  sugar: number | string;
  salt: number | string;
  grams: number | string;
};

type ScannedFoodContextType = {
  savedFood: FoodData[];
  addFood: (food: FoodData) => void;
  calculateTotalValues: () => {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
    salt: number;
    grams: number;
  };
};

const ScannedFood = createContext<ScannedFoodContextType>({
  savedFood: [],
  addFood: () => {
    console.log("empty");
  },
  calculateTotalValues: () => ({
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    sugar: 0,
    salt: 0,
    grams: 0,
  }),
});

export const ScannedFoodProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [savedFood, setSavedFood] = useState<FoodData[]>([]);

  const addFood = (food: FoodData) => {
    food.id = savedFood.length + 1;
    setSavedFood((prev) => [...prev, food]);
  };

  const calculateTotalValues = () => {
    return savedFood.reduce(
      (total, food) => {
        if (typeof food.kcal === "number") {
          total.kcal += food.kcal;
        }
        if (typeof food.protein === "number") {
          total.protein += food.protein;
        }
        if (typeof food.carbs === "number") {
          total.carbs += food.carbs;
        }
        if (typeof food.fat === "number") {
          total.fat += food.fat;
        }
        if (typeof food.sugar === "number") {
          total.sugar += food.sugar;
        }
        if (typeof food.salt === "number") {
          total.salt += food.salt;
        }
        if (typeof food.grams === "number") {
          total.grams += food.grams;
        }
        return total;
      },
      {
        kcal: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sugar: 0,
        salt: 0,
        grams: 0,
      },
    );
  };

  return (
    <ScannedFood.Provider value={{ savedFood, addFood, calculateTotalValues }}>
      {children}
    </ScannedFood.Provider>
  );
};

export const useScannedFood = () => useContext(ScannedFood);

export default function useScannedFoodContext() {
  return useContext(ScannedFood);
}
