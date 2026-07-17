import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
export default function ExerciseDiaryScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Exercise Screen.</Text>
      <Button
        title="Add activity"
        onPress={() => router.push("../add-activity")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#252625",
  },
  text: {
    color: "#fff",
  },
});
