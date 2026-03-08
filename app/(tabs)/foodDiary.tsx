import { Text, View, StyleSheet } from "react-native";
import ProgressCircle from "../../components/ProgressCircle";

export default function FoodDiaryScreen() {
  return (
    <View style={styles.container}>
      <ProgressCircle progressValue={0} />
      <Text style={styles.text}>Calorie Progress</Text>
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
