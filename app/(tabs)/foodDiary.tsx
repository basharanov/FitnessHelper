import React from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import ProgressCircle from "../../components/ProgressCircle";

export default function FoodDiaryScreen() {
  const [number, onChangeNumber] = React.useState("");

  return (
    <View style={styles.container}>
      <View style={styles.summaryBox}>
        <View style={styles.macroItem}>
          <ProgressCircle progressValue={number} size={150} />
          <Text style={styles.macroText}>Calories</Text>
        </View>
        <View style={styles.macrosContainer}>
          <View style={styles.macroItem}>
            <ProgressCircle progressValue={number} size={90} />
            <Text style={styles.macroText}>Protein</Text>
          </View>

          <View style={styles.macroItem}>
            <ProgressCircle progressValue={number} size={90} />
            <Text style={styles.macroText}>Carbs</Text>
          </View>

          <View style={styles.macroItem}>
            <ProgressCircle progressValue={number} size={90} />
            <Text style={styles.macroText}>Fat</Text>
          </View>
        </View>
      </View>

      <TextInput
        style={styles.inputText}
        onChangeText={onChangeNumber}
        value={number}
      ></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#252625",
    paddingTop: 60,
  },
  inputText: {
    color: "#fff",
    borderColor: "#fff",
    borderWidth: 0.5,
    backgroundColor: "#333",
    height: 40,
    width: 100,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  summaryBox: {
    borderWidth: 2,
    borderColor: "#888",
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  macrosContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },

  macroItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  macroText: {
    marginTop: 8,
    fontSize: 16,
    color: "#fff", // смени ако ползваш друг цвят
    textAlign: "center",
  },
});
