import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";
import { useAuthStore } from "../../context/authStore";
import { deleteToken } from "../../service/authToken";

export default function Profile() {
  const { logOut, user } = useAuthStore();

  const router = useRouter();

  async function logout() {
    await deleteToken();
    router.replace("/login");
  }

  const onSubmit = (data: any) => {
    logout();
    logOut();
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Profile:</Text>
      <Text>Username: {user.name}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Birth date: {user.birthDate.toString()}</Text>
      <Text>Height: {user.height}</Text>
      <Text>Current weight: {user.currentWeight}</Text>
      <Text>Goal weight: {user.goalWeight}</Text>
      <Button title="Logout" onPress={onSubmit}></Button>
    </View>
  );
}
