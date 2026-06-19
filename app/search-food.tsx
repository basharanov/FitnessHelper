import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, TextInput, View } from "react-native";
import SearchItem from "../components/SearchItem";
import { useScannedFood } from "../context/ScannedFoodContext";

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

export default function SearchFood() {
  const [error, setError] = useState("");
  const [scanned, setScanned] = useState(false);
  const { addFood } = useScannedFood();
  const [search, setSearch] = useState("");
  const [searchFood, setSearchFood] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food>();
  const [selectedFoodId, setSelectedFoodId] = useState<string | number>();

  const router = useRouter();

  async function searchMultipleFoods(string: string) {
    try {
      if (string.length <= 2) {
        return;
      }
      setError("");
      const response = await fetch(`http://192.168.1.3:3000/food/${string}`);

      const data = await response.json();
      if (!data) {
        setError("No data received");
        console.log(error);
      }
      console.log("DATA:", data);
      setSearchFood(data);
    } catch (err) {
      setError("Failed to fetch");
      console.log(err);
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchMultipleFoods(search);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textContent}
        value={search}
        onChangeText={setSearch}
      />

      <Button
        title="Add Food"
        onPress={() => {
          if (!selectedFood) {
            return;
          }
          router.replace({
            pathname: "/add-food",
            params: {
              foodD: JSON.stringify(selectedFood),
            },
          });
        }}
      ></Button>
      <FlatList
        data={searchFood}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <SearchItem
              food={item}
              isSelected={selectedFoodId === item.id}
              onPress={() => {
                setSelectedFood(item);
                setSelectedFoodId(item.id);
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
  camera: {
    flex: 1,
  },
  itemText: {
    margin: 10,
    color: "white",
    fontSize: 24,
    backgroundColor: "blue",
    width: "100%",
    height: 50,
  },
});
