import { postFetch } from "@/fetchHelper/baseFetch";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChangePasswordPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { passwordResetRequestId } = useLocalSearchParams<{
    passwordResetRequestId?: string | string[];
  }>();

  const resetRequestId = Array.isArray(passwordResetRequestId)
    ? passwordResetRequestId[0]
    : passwordResetRequestId;

  async function handleChangePassword() {
    if (!resetRequestId) {
      Alert.alert(
        "Invalid session",
        "The password reset session is missing. Please request a new code.",
      );
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert(
        "Invalid password",
        "The password must contain at least 8 characters.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Passwords do not match",
        "Please make sure both passwords are the same.",
      );
      return;
    }

    try {
      setIsLoading(true);

      const response = await postFetch("/reset-password/reset", {
        newPassword,
        passwordResetRequestId: resetRequestId,
      });

      if (!response) {
        Alert.alert(
          "Error",
          "The password could not be changed. Please try again.",
        );
        return;
      }

      Alert.alert(
        "Password changed",
        "Your password was changed successfully.",
        [
          {
            text: "Go to login",
            onPress: () => router.replace("/login"),
          },
        ],
      );
    } catch (error) {
      console.log("Failed to change password:", error);

      Alert.alert(
        "Error",
        "The reset session may have expired. Please request a new code.",
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
        <Text style={styles.title}>Create a new password</Text>

        <Text style={styles.description}>
          Enter your new password and confirm it below.
        </Text>

        <Text style={styles.label}>New password</Text>

        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter your new password"
          placeholderTextColor="#8b8b8b"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
          textContentType="newPassword"
        />

        <Text style={[styles.label, styles.confirmPasswordLabel]}>
          Confirm password
        </Text>

        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your new password"
          placeholderTextColor="#8b8b8b"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
          textContentType="newPassword"
          onSubmitEditing={handleChangePassword}
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
          onPress={() => router.replace("/change-password-code")}
          disabled={isLoading}
        >
          <Text style={styles.backButtonText}>Back to verification code</Text>
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
  confirmPasswordLabel: {
    marginTop: 18,
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
    marginTop: 24,
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
