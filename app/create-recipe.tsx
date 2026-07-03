import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import SearchItem from "../components/SearchItem";

const TEMP_USER_ID = "019edf77-9e38-7505-971d-7491dcef003b";

class Ingredient {
  id: string;
  name: string;
  grams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  salt: number;
  constructor(
    id: string,
    name: string,
    grams: number,
    kcal: number,
    protein: number,
    carbs: number,
    fat: number,
    sugar: number,
    salt: number,
  ) {
    this.id = id;
    this.name = name;
    this.grams = grams;
    this.kcal = kcal;
    this.protein = protein;
    this.carbs = carbs;
    this.fat = fat;
    this.sugar = sugar;
    this.salt = salt;
  }
}

export default function CreteRecipe() {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [portion, setPortion] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [searchIngredients, setSearchIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient>();
  const [selectedIngredientId, setSelectedIngredientId] = useState<
    string | number
  >();

  const router = useRouter();

  async function createRecipe(userId: string) {
    try {
      const recipeIngredients = ingredients.map((ingredient) => ({
        foodId: ingredient.id,
        grams: Number(ingredient.grams),
      }));
      const response = await fetch(`http://192.168.1.5:3000/recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          description: description,
          userId: userId,
          portions: parseInt(portion),
          timeMinutes: parseInt(time),
          ingredients: ingredients,
        }),
      });
    } catch (error) {
      console.log("Failed fetching the recipe");
    }
  }

  async function getMultipleIngredients(name: string) {
    try {
      if (name.length <= 2) {
        return setSearchIngredients([]);
      }
      const response = await fetch(`http://192.168.1.5:3000/food/${name}`);

      const data = await response.json();

      console.log("Data: ", data);
      setSearchIngredients(data);
    } catch (error) {
      console.log("Failed fetching data: ", error);
    }
  }

  function checkForDuplicatesIngredient(id: string) {
    let value = true;

    ingredients.map((ingredient) => {
      if (ingredient.id === id) {
        value = false;
      }
    });

    return value;
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getMultipleIngredients(search);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.text}>Name: </Text>
        <TextInput
          style={styles.textContent}
          value={name}
          onChangeText={setName}
        ></TextInput>
        <Text style={styles.text}>Time(minutes): </Text>
        <TextInput
          style={styles.textContent}
          value={time}
          onChangeText={setTime}
          keyboardType="number-pad"
        ></TextInput>
        <Text style={styles.text}>Portion: </Text>
        <TextInput
          style={styles.textContent}
          value={portion}
          onChangeText={setPortion}
          keyboardType="number-pad"
        ></TextInput>
        <Text style={styles.text}>Description: </Text>
        <TextInput
          style={styles.textContent}
          value={description}
          onChangeText={setDescription}
        ></TextInput>
        <Text style={styles.text}>Ingredients: </Text>
        {ingredients.map((item, index) => {
          return (
            <Text key={`${item.id}-${index}`} style={styles.smallText}>
              {item.name}
            </Text>
          );
        })}
        <TextInput
          style={styles.textContent}
          value={search}
          onChangeText={setSearch}
        ></TextInput>
        {searchIngredients.map((item, index) => {
          return (
            <View key={`${item.id}-${index}`}>
              <SearchItem
                food={item}
                isSelected={false}
                onPress={() => {
                  setSelectedIngredient(item);
                  setSelectedIngredientId(item.id);
                  if (checkForDuplicatesIngredient(item.id)) {
                    setIngredients((ingredient) => [...ingredients, item]);
                  }
                }}
              />
            </View>
          );
        })}
        <Button
          title="Crete Recipe"
          onPress={() => {
            createRecipe(TEMP_USER_ID);
            router.back();
          }}
        ></Button>
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
  smallText: {
    fontSize: 20,
    color: "#fff",
  },
});
