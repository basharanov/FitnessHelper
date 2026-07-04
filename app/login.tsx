import { Text, View, Button, TextInput } from "react-native";
import { Link, useRouter } from "expo-router";
import { useContext } from "react";
import { useAuthStore } from "../context/authStore";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginSchema } from "../validation/authSchemas";
import { saveToken } from "../service/authToken";

const API_URL = "http://192.168.1.5:3000";

export default function Login() {
  const { logIn } = useAuthStore();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
  });
  async function login(email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.log("Login failed:", data.message);
        return;
      }

      await saveToken(data.token);

      console.log("Login successful:", data.message);
      logIn();
    } catch (error) {
      console.log("Failed to log in", error);
    }
  }
  const onSubmit = (data: any) => {
    login(data.email, data.password);
    router.replace("/");
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

      <Button title="Register" onPress={() => router.replace("/register")} />

      <Button title="Login" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
