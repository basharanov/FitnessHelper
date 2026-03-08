import React from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import ProgressCircle from "../../components/ProgressCircle";

export default function FoodDiaryScreen() {
  const [number, onChangeNumber] = React.useState("");

  return (
    <View style={styles.container}>
      <ProgressCircle
        progressValue={number ? parseFloat(number) / 100 : 0}
        size={100}
      />
      <Text style={styles.text}>Calorie Progress</Text>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#252625",
  },
  text: {
    color: "#fff",
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
});
