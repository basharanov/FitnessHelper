import { CameraView, useCameraPermissions } from "expo-camera";
import { useRootNavigationState, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useScannedFood } from "../context/ScannedFoodContext";

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
      const response = await fetch(
        `http://192.168.1.5:3000/products/barcode/${string}`,
      );

      const data = await response.json();
      console.log("DATA:", data);
      return data;
    } catch (err) {
      setError("Failed to fetch");
      console.log(err);
    }
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
                //addFood(barcodeData);
                router.replace({
                  pathname: "/add-food",
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
