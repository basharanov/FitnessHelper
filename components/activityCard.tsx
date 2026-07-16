import { Pressable, StyleSheet, Text } from "react-native";
type ActivityType = {
  id: string;
  name: string;
  category: string;
};
type ActivityCardProps = {
  activity: ActivityType;
  onPress: () => void;
};
export default function ActivityCard({ activity, onPress }: ActivityCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <Text style={styles.text}>{activity.name.replaceAll("_", " ")}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth: 300,
    minHeight: 52,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: "#3A3C3A",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 6,
    marginHorizontal: 5,
  },

  cardPressed: {
    opacity: 0.7,
  },

  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
