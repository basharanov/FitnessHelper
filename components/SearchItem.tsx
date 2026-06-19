import { Pressable, StyleSheet, Text, View } from "react-native";

type Food = {
  id: number | string;
  name: string;
  kcal: number | string;
  carbs: number | string;
  fat: number | string;
  protein: number | string;
  salt: number | string;
  sugar: number | string;
  grams: number | string;
};

type Props = {
  food: Food;
  isSelected: boolean;
  onPress: () => void;
};

export default function SearchItem({ food, isSelected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isSelected && styles.selectedCard,
        pressed && styles.pressedCard,
      ]}
    >
      <View>
        <Text style={styles.name}>{food.name}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            Калории: <Text style={styles.value}>{food.kcal} kcal</Text>
          </Text>

          <Text style={styles.infoText}>
            Грамаж: <Text style={styles.value}>{food.grams} g</Text>
          </Text>
        </View>
      </View>

      {isSelected && <Text style={styles.selectedText}>Избрана</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 12,
    marginVertical: 6,
  },

  selectedCard: {
    borderColor: "#fcfcfc",
    borderWidth: 2,
    backgroundColor: "#30cf3d",
  },

  pressedCard: {
    opacity: 0.8,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  infoText: {
    fontSize: 14,
    color: "#4b5563",
  },

  value: {
    fontWeight: "600",
    color: "#111827",
  },

  selectedText: {
    marginTop: 8,
    fontSize: 13,
    color: "#111827",
    fontWeight: "600",
  },
});
