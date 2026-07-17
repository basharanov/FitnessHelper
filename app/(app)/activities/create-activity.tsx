import { postFetch } from "@/fetchHelper/baseFetch";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Slider from "@react-native-community/slider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Button,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function CreateActivity() {
  const { activityTypeId, activityName, category } = useLocalSearchParams<{
    activityTypeId: string;
    activityName: string;
    category: string;
  }>();

  const [startAt, setStartAt] = useState<Date>(new Date());
  const [endAt, setEndAt] = useState<Date>(new Date());
  const [iosValue, setIosValue] = useState("");
  const [show, setShow] = useState(false);
  const [intensity, setIntensity] = useState(0);
  const [notes, setNotes] = useState("");

  const router = useRouter();

  const handleButtonPress = async () => {
    try {
      const data = await postFetch("/activity", {
        activityTypeId: activityTypeId,
        startAt: startAt,
        endAt: endAt,
        intensity: intensity,
        notes: notes,
      });

      router.replace("/exerciseDiary");
    } catch (error) {
      console.log("Error with creating activity");
    }
  };

  const calculateDuration = (startAt: Date, endAt: Date) => {
    const durationMilliseconds = endAt.getTime() - startAt.getTime();

    if (durationMilliseconds <= 0) {
      return null;
    }

    const totalMinutes = Math.floor(durationMilliseconds / 1000 / 60);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
      return `${minutes} minutes`;
    }

    if (minutes === 0) {
      return `${hours} hours`;
    }

    return `${hours} hours and ${minutes} minutes`;
  };

  const setDates = (target: string, completedDate: Date) => {
    if (target === "start") {
      if (!checkValidDates(completedDate, endAt)) {
        Alert.alert(
          "Invalid time",
          "End of the activity must be after the start",
        );
        return;
      }

      setStartAt(completedDate);
      return;
    }

    if (!checkValidDates(startAt, completedDate)) {
      Alert.alert(
        "Invalid time",
        "End of the activity must be after the start",
      );
      return;
    }

    setEndAt(completedDate);
  };

  const checkValidDates = (start: Date, end: Date) => {
    if (start > end) {
      return false;
    }

    return true;
  };

  const openAndroidDateTimePicker = (target: string) => {
    const current = target === "start" ? startAt : endAt;

    DateTimePickerAndroid.open({
      value: current,
      mode: "date",

      onChange: (dateEvent: DateTimePickerEvent, selectedDate?: Date) => {
        if (!selectedDate) {
          console.log("error with date");
          return;
        }

        const dateSelected = new Date(selectedDate);

        DateTimePickerAndroid.open({
          value: current,
          mode: "time",
          is24Hour: true,

          onChange: (timeEvent: DateTimePickerEvent, selectedTime?: Date) => {
            if (!selectedTime) {
              console.log("error with time");
              return;
            }

            const completedDate = new Date(dateSelected);

            completedDate.setHours(
              selectedTime.getHours(),
              selectedTime.getMinutes(),
              0,
              0,
            );

            setDates(target, completedDate);
          },
        });
      },
    });
  };

  const openDateTimePicker = (target: string) => {
    if (Platform.OS === "android") {
      openAndroidDateTimePicker(target);
      return;
    }

    setIosValue(target);
    setShow(true);
  };

  const duration = calculateDuration(startAt, endAt);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.activityName}>{activityName}</Text>

      <Text style={styles.category}>{category}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Start time:</Text>

        <Pressable
          style={({ pressed }) => [
            styles.dateButton,
            pressed && styles.dateButtonPressed,
          ]}
          onPress={() => openDateTimePicker("start")}
        >
          <Text style={styles.dateText}>
            {`${startAt.getFullYear()}-${startAt.getMonth() + 1}-${startAt.getDate()}`}
          </Text>

          <Text style={styles.timeText}>
            {`${startAt.getHours()}:${String(startAt.getMinutes()).padStart(
              2,
              "0",
            )}`}
          </Text>
        </Pressable>

        <Text style={styles.label}>End time:</Text>

        <Pressable
          style={({ pressed }) => [
            styles.dateButton,
            pressed && styles.dateButtonPressed,
          ]}
          onPress={() => openDateTimePicker("end")}
        >
          <Text style={styles.dateText}>
            {`${endAt.getFullYear()}-${endAt.getMonth() + 1}-${endAt.getDate()}`}
          </Text>

          <Text style={styles.timeText}>
            {`${endAt.getHours()}:${String(endAt.getMinutes()).padStart(
              2,
              "0",
            )}`}
          </Text>
        </Pressable>

        {Platform.OS === "ios" && show && (
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerText}>
              Entering {iosValue === "start" ? "start time" : "end time"}
            </Text>

            <DateTimePicker
              value={iosValue === "start" ? startAt : endAt}
              mode="datetime"
              display="spinner"
              themeVariant="dark"
              onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                if (!selectedDate) {
                  return;
                }

                setDates(iosValue, selectedDate);
              }}
            />
          </View>
        )}

        <View style={styles.durationContainer}>
          <Text style={styles.durationLabel}>Duration:</Text>
          <Text style={styles.durationText}>
            {duration ?? "Invalid duration"}
          </Text>
        </View>
      </View>

      {category === "STRAIN" && (
        <View style={styles.section}>
          <View style={styles.intensityHeader}>
            <Text style={styles.label}>Intensity:</Text>
            <Text style={styles.intensityValue}>{intensity}/10</Text>
          </View>

          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={intensity}
            onValueChange={setIntensity}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#666866"
            thumbTintColor="#FFFFFF"
          />

          <View style={styles.sliderValues}>
            <Text style={styles.sliderValueText}>0</Text>
            <Text style={styles.sliderValueText}>10</Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Notes:</Text>

        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="How did the activity go?"
          placeholderTextColor="#858585"
          multiline
          textAlignVertical="top"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="add activity"
          color="#5D605D"
          onPress={() => {
            handleButtonPress();
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#252625",
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 50,
  },

  activityName: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },

  category: {
    color: "#A7A9A7",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 25,
  },

  section: {
    backgroundColor: "#323432",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
  },

  label: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  dateButton: {
    backgroundColor: "#414341",
    borderRadius: 13,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#505250",
  },

  dateButtonPressed: {
    opacity: 0.7,
  },

  dateText: {
    color: "#B8BAB8",
    fontSize: 14,
    marginBottom: 3,
  },

  timeText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },

  pickerContainer: {
    backgroundColor: "#3D3F3D",
    borderRadius: 14,
    padding: 12,
    marginBottom: 18,
  },

  pickerText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },

  durationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#414341",
    borderRadius: 12,
    padding: 14,
  },

  durationLabel: {
    color: "#A7A9A7",
    fontSize: 15,
  },

  durationText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  intensityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  intensityValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  slider: {
    width: "100%",
    height: 40,
  },

  sliderValues: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },

  sliderValueText: {
    color: "#989A98",
    fontSize: 13,
  },

  notesInput: {
    minHeight: 130,
    backgroundColor: "#414341",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#505250",
    color: "#FFFFFF",
    fontSize: 16,
    paddingHorizontal: 14,
    paddingTop: 14,
  },

  buttonContainer: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 4,
  },
});
