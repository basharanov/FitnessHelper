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

      router.replace("/(tabs)/exerciseDiary");
    } catch (error) {
      console.log(error);
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
          "Невалидно време",
          "Краят на активността трябва да бъде след началото.",
        );
        return;
      }
      setStartAt(completedDate);
      return;
    }
    if (!checkValidDates(startAt, completedDate)) {
      Alert.alert(
        "Невалидно време",
        "Краят на активността трябва да бъде след началото.",
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
    <ScrollView>
      <Text>{activityName}</Text>
      <Text>{category}</Text>
      <Text>Start time:</Text>
      <Pressable onPress={() => openDateTimePicker("start")}>
        <Text
          style={{ fontSize: 35 }}
        >{`${startAt.getFullYear()}-${startAt.getMonth() + 1}-${startAt.getDate()}: Hour: ${startAt.getHours()} minute: ${startAt.getMinutes()}`}</Text>
      </Pressable>
      <Text>End time: </Text>
      <Pressable onPress={() => openDateTimePicker("end")}>
        <Text
          style={{ fontSize: 35 }}
        >{`${endAt.getFullYear()}-${endAt.getMonth() + 1}-${endAt.getDate()}: Hour: ${endAt.getHours()} minute: ${endAt.getMinutes()}`}</Text>
      </Pressable>
      {Platform.OS === "ios" && show && (
        <View>
          <Text>
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
      <Text>Duration: {duration}</Text>
      {category === "STRAIN" && (
        <View>
          <Text>Intensity: </Text>
          <Slider
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={intensity}
            onValueChange={setIntensity}
          />
        </View>
      )}

      <Text>Notes: </Text>
      <TextInput value={notes} onChangeText={setNotes}></TextInput>
      <Button
        title="add activity"
        onPress={() => {
          handleButtonPress;
        }}
      ></Button>
    </ScrollView>
  );
}
