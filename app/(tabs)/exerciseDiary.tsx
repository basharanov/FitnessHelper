import { Text, View, StyleSheet } from "react-native";

export default function ExerciseDiaryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Exercise Screen.</Text>
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
