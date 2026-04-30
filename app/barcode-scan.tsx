import { CameraView } from "expo-camera";
import { useRootNavigationState, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function BarcodeScan() {
  const [error, setError] = useState("");
  const [scanned, setScanned] = useState(false);

  async function searchFood(string: string) {
    try {
      setError("");
      const response = await fetch(`http://192.168.1.2:3000/product/${string}`);
      const data = await response.json();
      console.log("DATA:", data);
      return data;
    } catch (err) {
      setError("Failed to fetch");
      console.log(err);
    }
  }
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const isProcessingRef = useRef(false);
  // State to prevent multiple scans

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
                router.replace({
                  pathname: "/foodDiary",
                  params: {
                    data: JSON.stringify(barcodeData),
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
});
