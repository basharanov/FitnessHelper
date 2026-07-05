import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { postFetch } from "@/fetchHelper/baseFetch";

const TEMP_USER_ID = "019edf77-9e38-7505-971d-7491dcef003b";

export default function CreateCustomFood() {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [kcal, setKcal] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [sugar, setSugar] = useState("");
  const [salt, setSalt] = useState("");
  const [grams, setGrams] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();

  async function createCustomFood(userId: string) {
    try {
      setError("");

      const data = await postFetch(`/custom-food`, {
        name: name,
        kcal: kcal,
        protein: protein,
        carbs: carbs,
        fat: fat,
        sugar: sugar,
        salt: salt,
        grams: grams,
        description: description,
      });

      if (!data.ok) {
        setError("Something went wrong");
        return;
      }
    } catch (err) {
      setError("Failed to fetch");
      console.log(error);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.text}>Name:</Text>
        <TextInput
          style={styles.textContent}
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.text}>Kcal:</Text>
        <TextInput
          style={styles.textContent}
          value={kcal}
          keyboardType="number-pad"
          onChangeText={setKcal}
        />
        <Text style={styles.text}>Protein:</Text>
        <TextInput
          style={styles.textContent}
          value={protein}
          keyboardType="number-pad"
          onChangeText={setProtein}
        />
        <Text style={styles.text}>Carbs:</Text>
        <TextInput
          style={styles.textContent}
          value={carbs}
          keyboardType="number-pad"
          onChangeText={setCarbs}
        />
        <Text style={styles.text}>Fats:</Text>
        <TextInput
          style={styles.textContent}
          value={fat}
          keyboardType="number-pad"
          onChangeText={setFat}
        />
        <Text style={styles.text}>Sugar:</Text>
        <TextInput
          style={styles.textContent}
          value={sugar}
          keyboardType="number-pad"
          onChangeText={setSugar}
        />
        <Text style={styles.text}>Salt:</Text>
        <TextInput
          style={styles.textContent}
          value={salt}
          keyboardType="number-pad"
          onChangeText={setSalt}
        />
        <Text style={styles.text}>Grams:</Text>
        <TextInput
          style={styles.textContent}
          value={grams}
          keyboardType="number-pad"
          onChangeText={setGrams}
        />
        <Text style={styles.text}>Description:</Text>
        <TextInput
          style={[styles.textContent, styles.descriptionInput]}
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
        />
        <Button
          title="Create custom food"
          onPress={() => {
            createCustomFood(TEMP_USER_ID);
            router.back();
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#252625",
  },
  content: {
    padding: 20,
    paddingBottom: 200,
  },

  descriptionInput: {
    minHeight: 120,
  },
  textContent: {
    fontSize: 20,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#555",
    marginBottom: 16,
    paddingVertical: 8,
  },
  text: {
    fontSize: 30,
    color: "#fff",
  },
});
