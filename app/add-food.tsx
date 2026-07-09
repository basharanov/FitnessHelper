import { postFetch } from "@/fetchHelper/baseFetch";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useDateStore } from "../context/dateStore";

export default function addFood() {
  const [grams, setGrams] = useState("100");
  const [gramsInNumber, setGramsInNumber] = useState(100);
  const [gramsError, setGramsError] = useState("");
  const [mealType, setMealType] = useState("breakfast");
  const selectedDate = useDateStore((state) => state.selectedDate);

  const createLog = async () => {
    const response = await postFetch("/food-logs", {
      date: selectedDate,
      sourceType: foodData.sourceType,
      mealType: mealType,
      foodId: foodData.id,
      grams: gramsInNumber,
    });
  };
  const handleGramsChange = (text: string) => {
    const isOnlyNumbers = /^[0-9]*$/.test(text);

    if (!isOnlyNumbers) {
      setGramsError("Enter only numbers");
      setGrams("0");
      return;
    }
    setGramsError("");
    setGrams(text);
    setGramsInNumber(Number(text));
  };
  const router = useRouter();
  const { foodD } = useLocalSearchParams<{
    foodD: string;
  }>();

  const foodData = JSON.parse(foodD);

  return (
    <View style={styles.container}>
      <View style={styles.foodNameView}>
        <Text style={styles.textContent}>{foodData.name}</Text>
      </View>
      <View style={styles.textInputView}>
        <Text style={styles.textContent}>Amount in grams:</Text>

        <TextInput
          value={grams}
          onChangeText={handleGramsChange}
          keyboardType="number-pad"
          style={styles.textContent}
        />
        {gramsError !== "" && (
          <Text style={{ color: "red" }}>{gramsError}</Text>
        )}
      </View>
      <View style={styles.nurtritionView}>
        <Text style={styles.textContent}>
          Calories {(foodData.kcal * (gramsInNumber / 100)).toFixed(2)}
        </Text>
        <Text style={styles.textContent}>
          Protein {(foodData.protein * (gramsInNumber / 100)).toFixed(2)}
        </Text>
        <Text style={styles.textContent}>
          Carbs {(foodData.carbs * (gramsInNumber / 100)).toFixed(2)}
        </Text>
        <Text style={styles.textContent}>
          Fats {(foodData.fat * (gramsInNumber / 100)).toFixed(1)}
        </Text>
        <Text style={styles.textContent}>
          Salt {(foodData.salt * (gramsInNumber / 100)).toFixed(2)}
        </Text>
        <Text style={styles.textContent}>
          Sugar {(foodData.sugar * (gramsInNumber / 100)).toFixed(1)}
        </Text>
        <View style={styles.pickerContainer}>
          <Text style={styles.textContent}>Choose meal type:</Text>
          <Picker
            selectedValue={mealType}
            onValueChange={(value) => setMealType(value)}
            style={styles.picker}
          >
            <Picker.Item label="Breakfast" value={"breakfast"} color="white" />
            <Picker.Item label="Lunch" value={"lunch"} />
            <Picker.Item label="Dinner" value={"dinner"} />
            <Picker.Item label="Snack" value={"snack"} />
          </Picker>
        </View>
      </View>
      <View style={styles.buttonView}>
        <Button
          title="Add Food"
          onPress={() => {
            createLog();
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#252625",
  },
  textContent: {
    fontSize: 20,
    color: "#fff",
  },
  foodNameView: {
    marginBottom: 20,
    textAlign: "center",
  },
  textInputView: {
    textAlign: "center",
    marginBottom: 20,
  },
  nurtritionView: {
    textAlign: "center",
    marginBottom: 20,
  },
  buttonView: {
    textAlign: "center",
    marginBottom: 20,
  },
  pickerContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
    overflow: "hidden",
    marginVertical: 10,
  },

  picker: {
    color: "white",
    height: 180,
    fontSize: 18,
    paddingHorizontal: 30,
  },

  pickerItem: {
    color: "white",
    fontSize: 18,
    height: 20,
  },
});
