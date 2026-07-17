import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, TextInput, View } from "react-native";
import SearchItem from "../../../../components/SearchItem";
import { getFetch } from "../../../../fetchHelper/baseFetch";

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

      const data = await getFetch(`/food/${string}`);

      setSearchFood(data);
    } catch (err) {
      console.log("Failed to get normal food from db");
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
            pathname: "/food/add-food",
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
