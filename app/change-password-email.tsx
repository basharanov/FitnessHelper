import { postFetch } from "@/fetchHelper/baseFetch";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function handleChangePassword() {
    if (!email.trim()) {
      Alert.alert("Missing email", "Please enter your email address.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await postFetch("/reset-password", {
        email: email,
      });

      console.log("hi");

      if (!response?.passwordResetRequestId) {
        Alert.alert(
          "Error",
          response?.message ?? "The reset code could not be sent.",
        );
        return;
      }

      router.replace({
        pathname: "/change-password-code",
        params: {
          passwordResetRequestId: response.passwordResetRequestId,
        },
      });
    } catch (error) {
      Alert.alert(
        "Error",
        "Something went wrong while sending the reset code.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Забравена парола</Text>

        <Text style={styles.description}>
          Въведи имейл на профила на който искаш да смениш паролата
        </Text>

        <Text style={styles.label}>Email</Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="example@email.com"
          placeholderTextColor="#8b8b8b"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleChangePassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Change password</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/login")}
          disabled={isLoading}
        >
          <Button
            title="Обратно към логин"
            onPress={() => router.replace("/login")}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    marginBottom: 12,
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "700",
  },
  description: {
    marginBottom: 28,
    color: "#b8b8b8",
    fontSize: 16,
    lineHeight: 23,
  },
  label: {
    marginBottom: 8,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  input: {
    height: 52,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#3a3a3a",
    borderRadius: 10,
    backgroundColor: "#1e1e1e",
    color: "#ffffff",
    fontSize: 16,
  },
  button: {
    height: 52,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#4f7cff",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  backButton: {
    marginTop: 22,
    alignItems: "center",
  },
  backButtonText: {
    color: "#9eb5ff",
    fontSize: 15,
    fontWeight: "600",
  },
});
