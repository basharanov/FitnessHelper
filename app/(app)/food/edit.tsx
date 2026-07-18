import { deleteFetch, getFetch, patchFetch } from "@/fetchHelper/baseFetch";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function EditFoodLogs() {
  const { foodLogId } = useLocalSearchParams<{
    foodLogId: string;
  }>();
  const [name, setName] = useState("");
  const [grams, setGrams] = useState(0);
  const [kcal, setKcal] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [sugar, setSugar] = useState(0);
  const [salt, setSalt] = useState(0);
  const [mealType, setMealType] = useState("");

  const [textGrams, setTextGrams] = useState("0");
  const router = useRouter();

  const getFoodLogInfo = async (foodLogId: string) => {
    try {
      const response = await getFetch(`/food-logs/edit/${foodLogId}`);
      console.log("DATA: ", response);
      setName(response.name);
      setGrams(Number(response.grams));
      setKcal(Number(response.kcal));
      setProtein(Number(response.protein));
      setCarbs(Number(response.carbs));
      setFat(Number(response.fat));
      setSugar(Number(response.sugar));
      setSalt(Number(response.salt));
      setMealType(response.mealType);
      setTextGrams(response.grams);
    } catch (error) {
      console.log("Failed to get food log");
    }
  };
  const updateFoodLogInfo = async (foodLogId: string) => {
    try {
      const response = await patchFetch(`/food-logs/edit/${foodLogId}`, {
        grams: Number(textGrams),
        mealType: mealType.toUpperCase(),
      });

      router.replace("/foodDiary");
    } catch (error) {
      console.log("Failed to update food log");
    }
  };
  const deleteFoodLogInfo = async (foodLogId: string) => {
    Alert.alert(
      "Delete",
      "Are you sure?",
      [
        {
          text: "Cancel",
          onPress: () => {
            return;
          },
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await deleteFetch(
                `/food-logs/edit/${foodLogId}`,
              );

              router.replace("/foodDiary");
            } catch (error) {
              console.log("Failed to delete food log");
            }
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {
          return;
        },
      },
    );
  };

  const nutritionValue = (value: number) => {
    if (grams <= 0) {
      return "0.00";
    }

    return (value * (Number(textGrams) / grams)).toFixed(2);
  };

  useEffect(() => {
    getFoodLogInfo(foodLogId);
  }, [foodLogId]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.foodNameView}>
          <Text style={styles.foodName}>{name}</Text>
        </View>

        <View style={styles.textInputView}>
          <Text style={styles.textContent}>Amount in grams:</Text>
          <TextInput
            value={textGrams}
            onChangeText={setTextGrams}
            keyboardType="number-pad"
            style={styles.gramsInput}
          />
        </View>

        <View style={styles.nutritionView}>
          <Text style={styles.textContent}>
            Calories {nutritionValue(kcal)}
          </Text>
          <Text style={styles.textContent}>
            Protein {nutritionValue(protein)}
          </Text>
          <Text style={styles.textContent}>Carbs {nutritionValue(carbs)}</Text>
          <Text style={styles.textContent}>Fats {nutritionValue(fat)}</Text>
          <Text style={styles.textContent}>Salt {nutritionValue(salt)}</Text>
          <Text style={styles.textContent}>Sugar {nutritionValue(sugar)}</Text>

          <View style={styles.pickerContainer}>
            <Text style={styles.textContent}>Choose meal type:</Text>
            <Picker
              selectedValue={mealType.toLowerCase()}
              onValueChange={(value) => setMealType(value)}
              style={styles.picker}
            >
              <Picker.Item label="Breakfast" value="breakfast" color="white" />
              <Picker.Item label="Lunch" value="lunch" color="white" />
              <Picker.Item label="Dinner" value="dinner" color="white" />
              <Picker.Item label="Snack" value="snack" color="white" />
            </Picker>
          </View>
        </View>

        <View style={styles.buttonView}>
          <Button title="Save" onPress={() => updateFoodLogInfo(foodLogId)} />
          <Button title="Delete" onPress={() => deleteFoodLogInfo(foodLogId)} />
          <Button title="Cancel" onPress={() => router.replace("/foodDiary")} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#252625",
    paddingHorizontal: 20,
  },
  foodNameView: {
    marginBottom: 20,
    alignItems: "center",
  },
  foodName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  textInputView: {
    marginBottom: 20,
  },
  textContent: {
    color: "#fff",
    fontSize: 20,
  },
  gramsInput: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    color: "#fff",
    fontSize: 20,
  },
  nutritionView: {
    marginBottom: 20,
    gap: 6,
  },
  pickerContainer: {
    marginVertical: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 12,
  },
  picker: {
    height: 180,
    paddingHorizontal: 30,
    color: "white",
    fontSize: 18,
  },
  buttonView: {
    gap: 10,
    marginBottom: 20,
  },
});
