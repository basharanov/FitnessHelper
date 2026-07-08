import { postFetch } from "@/fetchHelper/baseFetch";
import { yupResolver } from "@hookform/resolvers/yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { RegisterSchema } from "../validation/authSchemas";

export default function Register() {
  const [showDatePicker, setShowDatePicker] = useState(false);
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
      console.log(body);
      const data = await postFetch(`/auth/register`, body);

      console.log("Register status:", data.status);
      console.log("Register response:", data);

      if (!data.ok) {
        return;
      }
    } catch (error) {
      console.log("Failed to register", error);
    }
  }

  const onSubmit = (data: any) => {
    register({
      email: data.email,
      password: data.password,
      name: data.username,
      birthDate: data.birthDate,
      height: data.height,
      currentWeight: data.currentWeight,
      goalWeight: data.goalWeight,
    });
    router.replace("/login");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
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
                value={value}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === "android") {
                    setShowDatePicker(false);
                  }
                  if (selectedDate) {
                    onChange(selectedDate);
                  }
                  if (event.type === "dismissed") {
                    setShowDatePicker(false);
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
    </View>
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
});
