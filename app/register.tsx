import { yupResolver } from "@hookform/resolvers/yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Platform, Text, TextInput, View } from "react-native";
import { RegisterSchema } from "../validation/authSchemas";

const API_URL = "http://192.168.1.5:3000";

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

  async function register(
    email: string,
    password: string,
    birthDate: Date,
    weight: number,
  ) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          birthDate: birthDate,
          weight: weight,
        }),
      });
      const responseData = await response.json();

      console.log("Register status:", response.status);
      console.log("Register response:", responseData);

      if (!response.ok) {
        return;
      }
    } catch (error) {
      console.log("Failed to register", error);
    }
  }

  const onSubmit = (data: any) => {
    register(data.email, data.password, data.birthDate, data.weight);
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
          <TextInput onChangeText={onChange} value={value} />
        )}
      />
      <Text>Password:</Text>
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput secureTextEntry onChangeText={onChange} value={value} />
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
                value={new Date()}
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
                }}
              />
            )}
          </View>
        )}
      />
      <Text>Weigth:</Text>
      <Controller
        control={control}
        name="weight"
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
            placeholder="Example: 75.5"
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
