import { Text, View, StyleSheet } from "react-native";
import { Link, Stack } from "expo-router";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View style={styles.container}>
        <Link href={"/"} style={styles.button}>
          Go back to home page!
        </Link>
      </View>
    </>
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
    fontSize: 26,
  },
  button: {
    color: "#fff",
    fontSize: 26,
    textDecorationLine: "underline",
  },
});
