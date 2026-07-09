import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, TextInput, View } from "react-native";
import SearchItem from "../components/SearchItem";
import { getFetch } from "../fetchHelper/baseFetch";

type IngrediеntItems = {
  foodId: string;
  grams: number | string;
};

type RecipeItems = {
  id: string;
  name: string;
  description: string;
  userId: string;
  portions: number;
  timeMinutes: number;
  kcal: number;
  carbs: number;
  fat: number;
  protein: number;
  salt: number;
  sugar: number;
  ingredients: IngrediеntItems[];
  grams: number;
};

export default function Recipe() {
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [recipeData, setRecipeData] = useState<RecipeItems[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeItems>();
  const [selectedRecipeId, setSelectedRecipeId] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (search.length <= 0) {
      return;
    }
    const timeoutId = setTimeout(() => {
      searchMultipleRecipes(search);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  async function searchMultipleRecipes(name: string) {
    try {
      setError("");

      const data = await getFetch(`/recipe/${name}`);

      if (!data) {
        setError("No data received");
        console.log(error);
      }

      console.log("DATA:", data);
      setRecipeData(data);
    } catch (err) {
      console.log("Failed to fetch", err);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textContent}
        value={search}
        onChangeText={setSearch}
      />
      <Button
        title="add recipe"
        onPress={() => {
          if (!selectedRecipe) {
            return;
          }
          router.replace({
            pathname: "/add-food",
            params: {
              foodD: JSON.stringify(selectedRecipe),
            },
          });
        }}
      ></Button>
      <Button
        title="Create Recipe"
        onPress={() => {
          router.replace({
            pathname: "/create-recipe",
            params: {
              foodD: JSON.stringify(selectedRecipe),
            },
          });
        }}
      ></Button>
      <FlatList
        data={recipeData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <SearchItem
              food={item}
              isSelected={selectedRecipeId === item.id}
              onPress={() => {
                setSelectedRecipe(item);
                setSelectedRecipeId(item.id);
              }}
            />
          );
        }}
      />
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
});
