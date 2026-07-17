import { postFetch } from "@/fetchHelper/baseFetch";
import { RegisterSchema } from "@/validation/authSchemas";
import { yupResolver } from "@hookform/resolvers/yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Register() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(RegisterSchema),
  });

  async function register(body: object) {
    try {
      const data = await postFetch(`/auth/register`, body);
    } catch (error) {
      console.log("Failed to register", error);
    }
  }

  const onSubmit = (data: any) => {
    register({
      email: data.email,
      password: data.password,
      name: data.username,
      birthDate: date,
      height: Number(data.height),
      currentWeight: Number(data.currentWeight),
      goalWeight: Number(data.goalWeight),
    });
    router.replace("/login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text>Email:</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.textContent}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Text>Password:</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.textContent}
              secureTextEntry
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Text>Username:</Text>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.textContent}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Text>Date:</Text>
        <Controller
          control={control}
          name="birthDate"
          render={({ field: { onChange, value } }) => (
            <View>
              <Button
                title="Select Date"
                onPress={() => setShowDatePicker(true)}
              />

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  maximumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    if (Platform.OS === "android") {
                      setShowDatePicker(false);
                    }
                    if (selectedDate) {
                      setDate(selectedDate);
                      onChange(selectedDate);
                    }
                  }}
                />
              )}
            </View>
          )}
        />
        <Text>Height:</Text>
        <Controller
          control={control}
          name="height"
          render={({ field: { onChange, value } }) => (
            <TextInput
              onChangeText={(text) => {
                const returnVaL = Number(text);
                if (!Number.isNaN(returnVaL)) {
                  onChange(returnVaL);
                }
              }}
              keyboardType="decimal-pad"
              value={value}
              placeholder="Example: 182 cm"
              placeholderTextColor="grey"
              style={styles.textContent}
            />
          )}
        />
        <Text>Current weigth:</Text>
        <Controller
          control={control}
          name="currentWeight"
          render={({ field: { onChange, value } }) => (
            <TextInput
              onChangeText={(text) => {
                const returnVaL = Number(text);
                if (!Number.isNaN(returnVaL)) {
                  onChange(returnVaL);
                }
              }}
              keyboardType="decimal-pad"
              value={value}
              placeholder="Example: 75.5 kg"
              placeholderTextColor="grey"
              style={styles.textContent}
            />
          )}
        />
        <Text>Goal Weight:</Text>
        <Controller
          control={control}
          name="goalWeight"
          render={({ field: { onChange, value } }) => (
            <TextInput
              onChangeText={(text) => {
                const returnVaL = Number(text);
                if (!Number.isNaN(returnVaL)) {
                  onChange(returnVaL);
                }
              }}
              keyboardType="decimal-pad"
              value={value}
              placeholder="Example: 74 kg"
              placeholderTextColor="grey"
              style={styles.textContent}
            />
          )}
        />

        <Button title="Create Accout" onPress={handleSubmit(onSubmit)} />
        <Button
          title="Back to login"
          onPress={() => {
            router.replace("/login");
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  textContent: {
    fontSize: 20,
    color: "#0f0505",
    borderWidth: 1,
    borderColor: "#0c0b0b",
    marginBottom: 16,
    paddingVertical: 8,
    width: 250,
  },
  container: {
    flex: 1,
    paddingTop: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
    paddingBottom: 200,
  },
});
