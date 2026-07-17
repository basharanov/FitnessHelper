import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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

type ActivityLogsCardProps = {
  activity: ActivityLog;
  onPress: () => void;
};

export default function ActivityLogsCard({
  activity,
  onPress,
}: ActivityLogsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const activityName = activity.activityType.name
    .replaceAll("_", " ")
    .toUpperCase();

  const category = activity.activityType.category
    .replaceAll("_", " ")
    .toLowerCase();

  const startTime = new Date(activity.startAt).toLocaleTimeString("bg-BG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const endTime = new Date(activity.endAt).toLocaleTimeString("bg-BG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  function handlePress() {
    setIsExpanded((previousValue) => !previousValue);
    onPress();
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.header}>
        <Text style={styles.activityName}>{activityName}</Text>

        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{category}</Text>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <View style={styles.timeSection}>
          <Text style={styles.timeLabel}>Начало</Text>
          <Text style={styles.time}>{startTime}</Text>
        </View>

        <Text style={styles.timeSeparator}>→</Text>

        <View style={styles.timeSection}>
          <Text style={styles.timeLabel}>Край</Text>
          <Text style={styles.time}>{endTime}</Text>
        </View>
      </View>

      <Text style={styles.expandText}>
        {isExpanded ? "Скрий детайлите ▲" : "Покажи детайлите ▼"}
      </Text>

      {isExpanded && (
        <View style={styles.detailsContainer}>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Натоварване</Text>

            <View style={styles.effortBadge}>
              <Text style={styles.effortText}>{activity.effortLevel}/10</Text>
            </View>
          </View>

          <View style={styles.notesContainer}>
            <Text style={styles.detailLabel}>Бележки</Text>

            <Text style={styles.notes}>
              {activity.notes?.trim()
                ? activity.notes
                : "Няма добавени бележки."}
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    alignSelf: "stretch",
    marginBottom: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#454845",
    borderRadius: 16,
    backgroundColor: "#323432",
  },

  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  activityName: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  categoryContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#294732",
  },

  category: {
    color: "#8DE5A5",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  timeContainer: {
    marginTop: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    backgroundColor: "#272927",
  },

  timeSection: {
    alignItems: "center",
  },

  timeLabel: {
    marginBottom: 4,
    color: "#A8ADA8",
    fontSize: 12,
  },

  time: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  timeSeparator: {
    color: "#78D690",
    fontSize: 22,
    fontWeight: "700",
  },

  expandText: {
    marginTop: 14,
    color: "#83D99A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },

  detailsContainer: {
    marginTop: 4,
  },

  divider: {
    height: 1,
    marginVertical: 14,
    backgroundColor: "#4A4D4A",
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  detailLabel: {
    color: "#C6CAC6",
    fontSize: 14,
    fontWeight: "600",
  },

  effortBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#493E27",
  },

  effortText: {
    color: "#F2C66D",
    fontSize: 14,
    fontWeight: "700",
  },

  notesContainer: {
    marginTop: 16,
  },

  notes: {
    marginTop: 8,
    padding: 12,
    color: "#E1E3E1",
    fontSize: 14,
    lineHeight: 20,
    borderRadius: 10,
    backgroundColor: "#272927",
  },
});
