import { createContext, useContext, useState } from "react";
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

type ScannedFoodContextType = {
  savedFood: FoodData[];
  addFood: (food: FoodData) => void;
};

const ScannedFood = createContext<ScannedFoodContextType>({
  savedFood: [],
  addFood: () => {},
});

export const ScannedFoodProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [savedFood, setSavedFood] = useState<FoodData[]>([]);

  const addFood = (food: FoodData) => {
    setSavedFood((prev) => [...prev, food]);
  };

  return (
    <ScannedFood.Provider value={{ savedFood, addFood }}>
      {children}
    </ScannedFood.Provider>
  );
};

export const useScannedFood = () => useContext(ScannedFood);
