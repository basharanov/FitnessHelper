import { useAuthStore } from "../../context/authStore";
import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";
import { deleteToken } from "../../service/authToken";

export default function Profile() {
  const { logOut } = useAuthStore();

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
      <Text>Profile Screen</Text>
      <Button title="Logout" onPress={onSubmit}></Button>
    </View>
  );
}
