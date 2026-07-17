import { useDateStore } from "@/context/dateStore";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SelectedDatePicker() {
  const { selectedDate, setSelectedDate } = useDateStore();
  const [show, setShow] = useState(false);

  const insets = useSafeAreaInsets();

  const formatedDateForPressable = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1);
    const day = String(date.getDate());

    return `${year}/${month}/${day}`;
  };

  const openDateTimePickerAndroid = () => {
    DateTimePickerAndroid.open({
      value: selectedDate,
      mode: "date",
      onChange: (dateEvent: DateTimePickerEvent, selectedDate?: Date) => {
        if (!selectedDate) {
          return;
        }

        setSelectedDate(selectedDate);
      },
    });
  };

  const openDateTimePickerIOS = () => {
    setShow(true);
  };

  const openDateTimePicker = () => {
    if (Platform.OS === "android") {
      openDateTimePickerAndroid();
      return;
    }

    openDateTimePickerIOS();
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <Pressable
        onPress={() => openDateTimePicker()}
        style={({ pressed }) => [
          styles.datePressable,
          pressed && styles.datePressablePressed,
        ]}
      >
        <Text style={styles.dateText}>
          {formatedDateForPressable(selectedDate)}
        </Text>

        {Platform.OS === "ios" && show && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            style={styles.iosDatePicker}
            onChange={(event, selectedDate) => {
              setShow(false);
              if (!selectedDate) {
                return;
              }

              if (event.type === "dismissed") {
                return;
              }

              setSelectedDate(selectedDate);
            }}
          />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#252625",
    paddingBottom: 10,
  },

  datePressable: {
    minWidth: 130,
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B4245",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,

    elevation: 3,
  },

  datePressablePressed: {
    opacity: 0.75,
  },

  dateText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textAlign: "center",
    textTransform: "uppercase",
  },

  iosDatePicker: {
    marginTop: 8,
  },
});
