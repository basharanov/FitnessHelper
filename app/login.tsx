import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";
import { useAuthStore } from "../context/authStore";
import { postFetch } from "../fetchHelper/baseFetch";
import { LoginSchema } from "../validation/authSchemas";

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
      const data = await postFetch(`/auth/login`, {
        email,
        password,
      });

      if (data.token === undefined) {
        return;
      }

      logIn(data.token, {
        email: data.email,
        name: data.name,
        birthDate: data.birthDate,
        height: data.height,
        currentWeight: data.currentWeight,
        goalWeight: data.goalWeight,
      });
      console.log("Login successful:", data.message);
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
