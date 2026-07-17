import SearchItem from "@/components/SearchItem";
import { getFetch } from "@/fetchHelper/baseFetch";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, TextInput, View } from "react-native";

type CustomFood = {
  id: string;
  name: string;
  kcal: number | string;
  carbs: number | string;
  fat: number | string;
  protein: number | string;
  salt: number | string;
  sugar: number | string;
  grams: number | string;
  description: string;
};

export default function CustomFood() {
  const [customFoodData, setCustomFoodData] = useState<CustomFood[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCustomFoodData, setSelectedCustomFoodData] =
    useState<CustomFood>();
  const [selectedCustomFoodId, setSelectedCustomFoodId] = useState<
    string | number
  >();

  const router = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchMultipleCustomFoods(search);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  async function searchMultipleCustomFoods(name: string) {
    if (name.length <= 0 || !name.trim() || name === undefined || !name) {
      return;
    }

    try {
      const data = await getFetch(`/custom-food/${name}`);

      setCustomFoodData(data);
    } catch (error) {
      console.log("Failed to get custom foods");
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
        title="Add Custom Food"
        onPress={() => {
          if (!selectedCustomFoodData) {
            return;
          }
          router.replace({
            pathname: "/food/add-food",
            params: {
              foodD: JSON.stringify(selectedCustomFoodData),
            },
          });
        }}
      ></Button>
      <Button
        title="Create custom food"
        onPress={() => {
          router.push({
            pathname: "/food/customFood/create-custom-food",
          });
        }}
      ></Button>
      <FlatList
        data={customFoodData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <SearchItem
              food={item}
              isSelected={selectedCustomFoodId === item.id}
              onPress={() => {
                setSelectedCustomFoodData(item);
                setSelectedCustomFoodId(item.id);
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
