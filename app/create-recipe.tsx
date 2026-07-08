import { getFetch, postFetch } from "@/fetchHelper/baseFetch";
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
import RecipeIngredientItem from "../components/RecipeIngredientItem";
import SearchItem from "../components/SearchItem";

class Ingredient {
  id: string;
  name: string;
  grams: number;
  baseGrams?: number;
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
    baseGrams?: number,
  ) {
    this.id = id;
    this.name = name;
    this.grams = grams;
    this.baseGrams = baseGrams;
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

  async function createRecipe() {
    try {
      const data = await postFetch(`/recipe`, {
        name: name,
        description: description,
        portions: parseInt(portion),
        timeMinutes: parseInt(time),
        ingredients: ingredients,
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
      const data = await getFetch(`/food/${name}`);
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
  function changeIngredientGrams(id: string, grams: number) {
    setIngredients((prevIngredients) =>
      prevIngredients.map((ingredient) =>
        ingredient.id === id ? { ...ingredient, grams } : ingredient,
      ),
    );
  }

  function removeIngredient(id: string) {
    setIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient.id !== id),
    );
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

        {ingredients.map((item) => {
          return (
            <RecipeIngredientItem
              key={item.id}
              ingredient={{
                id: item.id,
                name: item.name,
                grams: item.grams,
                baseGrams: item.baseGrams ?? item.grams,
                kcal: item.kcal,
              }}
              onChangeGrams={changeIngredientGrams}
              onRemove={removeIngredient}
            />
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
                    const ingredientToAdd = {
                      ...item,
                      baseGrams: item.grams,
                    };

                    setIngredients((prevIngredients) => [
                      ...prevIngredients,
                      ingredientToAdd,
                    ]);
                  }
                  setSearch("");
                }}
              />
            </View>
          );
        })}
        <Button
          title="Crete Recipe"
          onPress={() => {
            createRecipe();
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
