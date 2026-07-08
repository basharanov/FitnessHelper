import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export type RecipeIngredient = {
  id: string;
  name: string;
  grams: number; // грамажът, който потребителят е избрал за рецептата
  baseGrams: number; // грамажът от базата, например 100
  kcal: number; // калориите от базата за baseGrams
};

type RecipeIngredientItemProps = {
  ingredient: RecipeIngredient;
  onChangeGrams: (id: string, grams: number) => void;
  onRemove?: (id: string) => void;
};

export default function RecipeIngredientItem({
  ingredient,
  onChangeGrams,
  onRemove,
}: RecipeIngredientItemProps) {
  const [gramsInput, setGramsInput] = useState(String(ingredient.grams));

  useEffect(() => {
    setGramsInput(String(ingredient.grams));
  }, [ingredient.grams]);

  const calculatedKcal =
    ingredient.baseGrams > 0
      ? (ingredient.grams / ingredient.baseGrams) * ingredient.kcal
      : 0;

  function handleGramsChange(text: string) {
    const normalizedText = text.replace(",", ".");

    if (!/^\d*\.?\d*$/.test(normalizedText)) {
      return;
    }

    setGramsInput(normalizedText);

    const gramsNumber = normalizedText === "" ? 0 : Number(normalizedText);

    if (!Number.isNaN(gramsNumber)) {
      onChangeGrams(ingredient.id, gramsNumber);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{ingredient.name}</Text>

        <Text style={styles.kcal}>{calculatedKcal.toFixed(1)} kcal</Text>
      </View>

      <View style={styles.gramsContainer}>
        <TextInput
          value={gramsInput}
          onChangeText={handleGramsChange}
          keyboardType="decimal-pad"
          style={styles.input}
        />

        <Text style={styles.gramsText}>g</Text>
      </View>

      {onRemove && (
        <Pressable onPress={() => onRemove(ingredient.id)}>
          <Text style={styles.removeText}>Remove</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  infoContainer: {
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  kcal: {
    fontSize: 14,
    marginTop: 4,
  },
  gramsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    width: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 16,
  },
  gramsText: {
    fontSize: 16,
  },
  removeText: {
    marginTop: 10,
    color: "red",
    fontWeight: "500",
  },
});
