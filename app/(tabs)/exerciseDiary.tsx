import ActivityLogsCard from "@/components/ActivityLogsCard";
import { useDateStore } from "@/context/dateStore";
import { getFetch } from "@/fetchHelper/baseFetch";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, View } from "react-native";
type ActivityLog = {
  id: string;
  userId: string;
  activityTypeId: string;
  startAt: string;
  endAt: string;
  effortLevel: number;
  notes: string;
  activityType: {
    name: string;
    category: string;
  };
};
export default function ExerciseDiaryScreen() {
  const selectedDate = useDateStore((state) => state.selectedDate);
  const router = useRouter();
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  async function getFoodLogsByDate() {
    try {
      const selectDate = selectedDate;
      const year = selectDate.getFullYear();
      const month = String(selectDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectDate.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;

      const data = await getFetch(`/activity/activity-logs/${formattedDate}`);
      setLogs(data.logs);
    } catch (error) {
      console.log("Failed fetching food logs:", error);
    }
  }

  useEffect(() => {
    getFoodLogsByDate();
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <Button
        title="Add activity"
        onPress={() => router.push("../add-activity")}
      />
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={logs}
        renderItem={({ item }) => (
          <ActivityLogsCard activity={item} onPress={() => {}} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#252625",
  },
  text: {
    color: "#fff",
  },
  list: {
    width: "100%",
  },

  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 20,
  },
});
