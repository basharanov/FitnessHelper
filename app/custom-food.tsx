import { getFetch } from "@/fetchHelper/baseFetch";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, TextInput, View } from "react-native";
import SearchItem from "../components/SearchItem";

const TEMP_USER_ID = "019edf77-9e38-7505-971d-7491dcef003b";

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
  const [error, setError] = useState("");
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
      searchMultipleCustomFoods(search, TEMP_USER_ID);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  async function searchMultipleCustomFoods(name: string, userId: string) {
    try {
      setError("");

      const data = await getFetch(`/custom-food/${name}?userId=${userId}`);

      if (!data) {
        setError("No data received");
        console.log(error);
      }

      console.log("DATA:", data);
      setCustomFoodData(data);
    } catch (err) {
      setError("Failed to fetch");
      console.log(error);
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
            pathname: "/add-food",
            params: {
              foodD: JSON.stringify(selectedCustomFoodData),
            },
          });
        }}
      ></Button>
      <Button
        title="Create custom food"
        onPress={() => {
          router.replace({
            pathname: "/create-custom-food",
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
