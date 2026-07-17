import { getFetch } from "@/fetchHelper/baseFetch";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import ActivityCard from "../components/ActivityCard";

type ActivityType = {
  id: string;
  name: string;
  category: "STRAIN" | "RECOVERY" | "SLEEP";
};

export default function addActivity() {
  const [search, setSearch] = useState("");
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const router = useRouter();

  const getActivities = async (category: string) => {
    try {
      const activities = await getFetch(
        `/activity/activity-types?category=${category}`,
      );

      if (!activities) {
        return setActivityTypes([]);
      }
      setActivityTypes(activities);
    } catch (error) {
      console.log("Problem with fetching activity type by category");
    }
  };

  useEffect(() => {
    async function loadActivities() {
      await getActivities("All");
    }
    loadActivities();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textContent}
        value={search}
        onChangeText={setSearch}
        placeholder="Search"
        placeholderTextColor="grey"
      />
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => {
            setSelectedFilter("All");
            getActivities("All");
          }}
        >
          <Text
            style={selectedFilter === "All" ? styles.selectedText : styles.text}
          >
            All
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setSelectedFilter("Strain");
            getActivities("Strain");
          }}
        >
          <Text
            style={
              selectedFilter === "Strain" ? styles.selectedText : styles.text
            }
          >
            Strain
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setSelectedFilter("Recovery");
            getActivities("Recovery");
          }}
        >
          <Text
            style={
              selectedFilter === "Recovery" ? styles.selectedText : styles.text
            }
          >
            Recovery
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setSelectedFilter("Sleep");
            getActivities("Sleep");
          }}
        >
          <Text
            style={
              selectedFilter === "Sleep" ? styles.selectedText : styles.text
            }
          >
            Sleep
          </Text>
        </Pressable>
      </View>
      <FlatList
        data={activityTypes.filter((activity) => {
          return activity.name
            .replaceAll("_", " ")
            .includes(search.toUpperCase());
        })}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ActivityCard
            activity={item}
            onPress={() => {
              router.push({
                pathname: "/create-activity",
                params: {
                  activityTypeId: item.id,
                  activityName: item.name.replaceAll("_", " "),
                  category: item.category,
                },
              });
            }}
          ></ActivityCard>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#252625",
  },
  textContent: {
    fontSize: 20,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#555",
    marginBottom: 16,
    paddingVertical: 8,
    width: 250,
    marginTop: 40,
  },
  text: {
    color: "#9A9A9A",
    fontSize: 15,
    fontWeight: "600",
    padding: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  selectedText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    padding: 15,
  },
});
