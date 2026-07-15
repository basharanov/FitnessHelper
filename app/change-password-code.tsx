import { postFetch } from "@/fetchHelper/baseFetch";
import { useLocalSearchParams, useRouter } from "expo-router";
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

export default function ChangePasswordCode() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { passwordResetRequestId } = useLocalSearchParams<{
    passwordResetRequestId?: string | string[];
  }>();

  const resetRequestId = Array.isArray(passwordResetRequestId)
    ? passwordResetRequestId[0]
    : passwordResetRequestId;

  async function handleVerifyCode() {
    const normalizedCode = code.trim();

    if (!resetRequestId) {
      Alert.alert(
        "Invalid session",
        "The password reset session is missing. Please request a new code.",
      );
      return;
    }

    if (!/^\d{6}$/.test(normalizedCode)) {
      Alert.alert(
        "Invalid code",
        "Please enter the six-digit code from your email.",
      );
      return;
    }

    try {
      setIsLoading(true);

      const response = await postFetch("/reset-password/validate", {
        code: normalizedCode,
        passwordResetRequestId: resetRequestId,
      });

      if (!response?.passwordResetRequestId) {
        Alert.alert(
          "Invalid code",
          response?.message ?? "The code is incorrect or has expired.",
        );
        return;
      }

      router.replace({
        pathname: "/change-password-password",
        params: {
          passwordResetRequestId: response.passwordResetRequestId,
        },
      });
    } catch (error) {
      console.log("Failed to validate password reset code:", error);

      Alert.alert("Error", "Something went wrong while validating the code.");
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
        <Text style={styles.title}>Enter verification code</Text>

        <Text style={styles.description}>
          Enter the six-digit code that was sent to your email address.
        </Text>

        <Text style={styles.label}>Verification code</Text>

        <TextInput
          style={styles.input}
          value={code}
          onChangeText={(value) => {
            const numericValue = value.replace(/[^0-9]/g, "");
            setCode(numericValue);
          }}
          placeholder="123456"
          placeholderTextColor="#8b8b8b"
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
          editable={!isLoading}
          textContentType="oneTimeCode"
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleVerifyCode}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Verify code</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/change-password-email")}
          disabled={isLoading}
        >
          <Button
            title="Смени имейла"
            onPress={() => router.replace("/change-password-email")}
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
    height: 60,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#3a3a3a",
    borderRadius: 10,
    backgroundColor: "#1e1e1e",
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: 10,
    textAlign: "center",
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
