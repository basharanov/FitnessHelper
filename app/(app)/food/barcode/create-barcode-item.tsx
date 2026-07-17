import { postFetch } from "@/fetchHelper/baseFetch";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type BarcodeFoodData = {
  barcode: string;
  name: string | null;
  grams?: number | null;
  kcal: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  sugar: number | null;
  salt: number | null;
};

type FormState = {
  name: string;
  kcal: string;
  protein: string;
  carbs: string;
  fat: string;
  sugar: string;
  salt: string;
};

type NutritionKey = Exclude<keyof FormState, "name">;

const nutritionFields: {
  key: NutritionKey;
  label: string;
  unit: string;
  placeholder: string;
}[] = [
  {
    key: "kcal",
    label: "Калории",
    unit: "kcal",
    placeholder: "Напр. 250",
  },
  {
    key: "protein",
    label: "Протеин",
    unit: "g",
    placeholder: "Напр. 12.5",
  },
  {
    key: "carbs",
    label: "Въглехидрати",
    unit: "g",
    placeholder: "Напр. 45",
  },
  {
    key: "fat",
    label: "Мазнини",
    unit: "g",
    placeholder: "Напр. 8",
  },
  {
    key: "sugar",
    label: "Захари",
    unit: "g",
    placeholder: "Напр. 15",
  },
  {
    key: "salt",
    label: "Сол",
    unit: "g",
    placeholder: "Напр. 0.6",
  },
];

const defaultFoodData: BarcodeFoodData = {
  barcode: "",
  name: "",
  kcal: null,
  protein: null,
  carbs: null,
  fat: null,
  sugar: null,
  salt: null,
};

function getStringParam(param: string | string[] | undefined) {
  if (Array.isArray(param)) {
    return param[0];
  }

  return param;
}

function parseFoodData(param: string | string[] | undefined): BarcodeFoodData {
  const foodDataString = getStringParam(param);

  if (!foodDataString) {
    return defaultFoodData;
  }

  try {
    const parsedData = JSON.parse(foodDataString);

    return {
      ...defaultFoodData,
      ...parsedData,
    };
  } catch (error) {
    console.log("Failed parsing food data: ", error);
    return defaultFoodData;
  }
}

function toInputValue(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function parseNumberInput(value: string) {
  const normalizedValue = value.trim().replace(",", ".");

  if (!normalizedValue) {
    return null;
  }

  const numberValue = Number(normalizedValue);

  if (!Number.isFinite(numberValue)) {
    return null;
  }

  return numberValue;
}

function sanitizeNumberInput(value: string) {
  return value.replace(/[^0-9.,]/g, "");
}

export default function CreateBarcodeItem() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const foodData = useMemo(() => {
    return parseFoodData(params.foodData);
  }, [params.foodData]);

  const [form, setForm] = useState<FormState>({
    name: foodData.name ?? "",
    kcal: toInputValue(foodData.kcal),
    protein: toInputValue(foodData.protein),
    carbs: toInputValue(foodData.carbs),
    fat: toInputValue(foodData.fat),
    sugar: toInputValue(foodData.sugar),
    salt: toInputValue(foodData.salt),
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const [isSaving, setIsSaving] = useState(false);

  const missingFields = nutritionFields.filter((field) => {
    return foodData[field.key] === null || foodData[field.key] === undefined;
  });

  const missingFieldsText = missingFields
    .map((field) => field.label.toLowerCase())
    .join(", ");

  function updateField(field: keyof FormState, value: string) {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));

    if (field === "name") {
      setForm((currentForm) => ({
        ...currentForm,
        [field]: value,
      }));

      return;
    }

    setForm((currentForm) => ({
      ...currentForm,
      [field]: sanitizeNumberInput(value),
    }));
  }

  function validateForm() {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) {
      newErrors.name = "Въведи име на продукта.";
    }

    for (const field of nutritionFields) {
      const value = parseNumberInput(form[field.key]);

      if (value === null) {
        newErrors[field.key] = "Въведи валидно число.";
        continue;
      }

      if (value < 0) {
        newErrors[field.key] = "Стойността не може да е отрицателна.";
      }
    }

    const carbs = parseNumberInput(form.carbs);
    const sugar = parseNumberInput(form.sugar);

    if (carbs !== null && sugar !== null && sugar > carbs) {
      newErrors.sugar = "Захарите не могат да са повече от въглехидратите.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function saveBarcodeFood() {
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const payload = {
      barcode: foodData.barcode,
      name: form.name.trim(),
      grams: 100,
      kcal: parseNumberInput(form.kcal),
      protein: parseNumberInput(form.protein),
      carbs: parseNumberInput(form.carbs),
      fat: parseNumberInput(form.fat),
      sugar: parseNumberInput(form.sugar),
      salt: parseNumberInput(form.salt),
    };

    try {
      setIsSaving(true);

      const createdFood = await postFetch("/products/barcode", payload);

      router.replace({
        pathname: "/food/add-food",
        params: {
          foodD: JSON.stringify(createdFood ?? payload),
        },
      });
    } catch (error) {
      console.log("Failed saving barcode food: ", error);

      Alert.alert(
        "Грешка",
        "Продуктът не беше запазен. Провери данните и опитай отново.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function scanAgain() {
    router.replace("/food/barcode/barcode-scan");
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Добави информация за продукта</Text>

        <Text style={styles.description}>
          Сканираният продукт няма пълна хранителна информация. Въведи
          стойностите от етикета за 100 г продукт.
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Сканиран баркод</Text>
          <Text style={styles.barcodeText}>
            {foodData.barcode || "Няма баркод"}
          </Text>

          {missingFields.length > 0 && (
            <Text style={styles.missingText}>
              Липсваща информация: {missingFieldsText}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Продукт</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Име на продукта</Text>

            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={form.name}
              onChangeText={(value) => updateField("name", value)}
              placeholder="Напр. Протеинов бар шоколад"
              autoCapitalize="sentences"
            />

            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Хранителни стойности за 100 г</Text>

          <Text style={styles.helperText}>
            Използвай стойностите от етикета, които са написани за 100 г. Не
            въвеждай стойности за порция или за целия пакет.
          </Text>

          {nutritionFields.map((field) => {
            const isMissingFromApi =
              foodData[field.key] === null || foodData[field.key] === undefined;

            return (
              <View key={field.key} style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>{field.label}</Text>

                  {isMissingFromApi && (
                    <Text style={styles.requiredBadge}>Липсва</Text>
                  )}
                </View>

                <View
                  style={[
                    styles.nutritionInputWrapper,
                    errors[field.key] && styles.inputError,
                  ]}
                >
                  <TextInput
                    style={styles.nutritionInput}
                    value={form[field.key]}
                    onChangeText={(value) => updateField(field.key, value)}
                    placeholder={field.placeholder}
                    keyboardType="decimal-pad"
                  />

                  <Text style={styles.unitText}>{field.unit}</Text>
                </View>

                {errors[field.key] && (
                  <Text style={styles.errorText}>{errors[field.key]}</Text>
                )}
              </View>
            );
          })}
        </View>

        <Pressable
          style={[styles.saveButton, isSaving && styles.disabledButton]}
          onPress={saveBarcodeFood}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? "Запазване..." : "Запази продукта"}
          </Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={scanAgain}>
          <Text style={styles.secondaryButtonText}>Сканирай отново</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 22,
    marginBottom: 18,
  },
  infoBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  infoLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  barcodeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 10,
  },
  missingText: {
    fontSize: 14,
    color: "#B45309",
    backgroundColor: "#FEF3C7",
    padding: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  helperText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  requiredBadge: {
    fontSize: 12,
    color: "#92400E",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: "hidden",
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
  },
  nutritionInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  nutritionInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
  },
  unitText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
    marginLeft: 8,
  },
  inputError: {
    borderColor: "#DC2626",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: "#111827",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 15,
    fontWeight: "600",
  },
});
