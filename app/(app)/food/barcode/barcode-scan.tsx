import { useScannedFood } from "@/context/ScannedFoodContext";
import { getFetch } from "@/fetchHelper/baseFetch";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRootNavigationState, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

type barcodeData = {
  barcode: string;
  name: string;
  grams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  salt: number;
};

export default function BarcodeScan() {
  const [error, setError] = useState("");
  const [scanned, setScanned] = useState(false);
  const { addFood } = useScannedFood();
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const isProcessingRef = useRef(false);
  // State to prevent multiple scans
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  async function searchFood(string: string) {
    try {
      setError("");

      const data = await getFetch(`/products/barcode/${string}`);

      return data;
    } catch (err) {
      setError("Failed to fetch");
      console.log(err);
    }
  }

  function validateBarcodeData(data: barcodeData) {
    if (
      data.kcal === null ||
      data.protein === null ||
      data.carbs === null ||
      data.fat === null ||
      data.sugar === null ||
      data.salt === null
    ) {
      return false;
    }
    return true;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
        }}
        // Handle barcode scanning
        onBarcodeScanned={
          scanned
            ? undefined
            : async ({ data }) => {
                if (isProcessingRef.current) return;
                if (!rootNavigationState?.key) return;

                isProcessingRef.current = true;
                setScanned(true);
                const barcodeData = await searchFood(data);
                if (!barcodeData) {
                  isProcessingRef.current = false;
                  setScanned(false);
                  return;
                }

                if (!validateBarcodeData(barcodeData)) {
                  router.replace({
                    pathname: "/food/barcode/create-barcode-item",
                    params: { foodData: JSON.stringify(barcodeData) },
                  });
                  return;
                }

                router.replace({
                  pathname: "/food/add-food",
                  params: {
                    foodD: JSON.stringify(barcodeData),
                  },
                });
              }
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
});
