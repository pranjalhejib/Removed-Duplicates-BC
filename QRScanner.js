import React, {useState, useEffect, useRef} from "react";
import {View, Text, Button, StyleSheet, TouchableOpacity, Alert, ActivityIndicator} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { appendToSheet, initializeSheet } from './appsScriptService';

const QRScanner = () => {
  const [facing,getFacing] = useState("back");
  const [permission,requestPermission] = useCameraPermissions();
  const [scanned,setScanned] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [recentlyScanned, setRecentlyScanned] = useState([]);
  const [scannedHistory, setScannedHistory] = useState([]);
  const navigation = useNavigation();
  
  // Add refs for debouncing
  const lastScannedCode = useRef(null);
  const lastScanTime = useRef(0);
  const isProcessing = useRef(false);
  const DEBOUNCE_TIME = 2000; // 2 seconds debounce time

  // Initialize Google Sheet when component mounts
  useEffect(() => {
    const initSheet = async () => {
      try {
        const success = await initializeSheet();
        setIsInitialized(success);
        if (!success) {
          Alert.alert(
            "Error",
            "Failed to initialize Google Sheet. Some features may not work properly.",
            [{ text: "OK" }]
          );
        }
      } catch (error) {
        console.error('Error initializing sheet:', error);
        Alert.alert(
          "Error",
          "An error occurred while initializing the app. Please try again.",
          [{ text: "OK" }]
        );
      }
    };

    initSheet();
  }, []);

  if(!permission) return <View />;

  if(!permission.granted) {
    return (
      <View style={styles.container} >
        <Text style={styles.message}>We need your permission to access the camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const handleScan = async ({data,type}) => {
    // Skip if already processing a scan
    if (isProcessing.current) {
      return;
    }

    // 1. Implement debounce logic
    const now = Date.now();
    if (lastScannedCode.current === data && now - lastScanTime.current < DEBOUNCE_TIME) {
      return; // Skip this scan if it's the same code within debounce time
    }
    
    // 2. Update last scanned code and time
    lastScannedCode.current = data;
    lastScanTime.current = now;
    isProcessing.current = true;
    
    // 3. Check if this barcode was recently scanned
    if (recentlyScanned.includes(data)) {
      Alert.alert(
        "Duplicate Entry",
        `Barcode ${data} was recently scanned. Please wait before scanning again.`,
        [{ text: "OK" }]
      );
      isProcessing.current = false;
      return;
    }
    
    // 4. Check if this barcode exists in our history
    if (scannedHistory.includes(data)) {
      Alert.alert(
        "Duplicate Entry",
        `Barcode ${data} has already been scanned in this session.`,
        [{ text: "OK" }]
      );
      isProcessing.current = false;
      return;
    }
    
    if(!scanned) {
      setScanned(true);
      setIsSaving(true);
      
      try {
        // 5. Save to Google Sheets
        const response = await appendToSheet(data);
        
        if (response.success) {
          // 6. Update local state for duplicate prevention
          setRecentlyScanned(prev => [...prev, data]);
          setScannedHistory(prev => [...prev, data]);
          
          // 7. Remove from recently scanned after 5 minutes
          setTimeout(() => {
            setRecentlyScanned(prev => prev.filter(code => code !== data));
          }, 300000); // 5 minutes
          
          Alert.alert(
            "Success",
            `Scanned Data: ${data}\nData saved to Google Sheets!`,
            [
              {
                text: "OK",
                onPress: () => {
                  setScanned(false);
                  setIsSaving(false);
                  isProcessing.current = false;
                  navigation.navigate('Home');
                }
              }
            ]
          );
        } else if (response.duplicate) {
          Alert.alert(
            "Duplicate Entry",
            `Barcode ${data} already exists in inventory.`,
            [
              {
                text: "OK",
                onPress: () => {
                  setScanned(false);
                  setIsSaving(false);
                  isProcessing.current = false;
                }
              }
            ]
          );
        } else {
          Alert.alert(
            "Error",
            response.message || "Failed to save data to Google Sheets. Please try again.",
            [
              {
                text: "OK",
                onPress: () => {
                  setScanned(false);
                  setIsSaving(false);
                  isProcessing.current = false;
                }
              }
            ]
          );
        }
      } catch (error) {
        console.error('Error saving data:', error);
        Alert.alert(
          "Error",
          "An error occurred while saving data. Please try again.",
          [
            {
              text: "OK",
              onPress: () => {
                setScanned(false);
                setIsSaving(false);
                isProcessing.current = false;
              }
            }
          ]
        );
      } finally {
        // Always reset the states
        setIsSaving(false);
        setScanned(false);
        isProcessing.current = false;
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(prev => (prev === "back" ? "front" : "back"));
  };

  return (
    <View style={styles.container} >
      <CameraView 
        style={styles.camera}
        facing={facing === "back" ? "back" : "front"}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e", "code39", "code128", "datamatrix", "pdf417"]
        }}
        onBarcodeScanned={scanned ? undefined : handleScan}
      >
        <View style={styles.overlay} >
          <View style={styles.scanArea} />
          {isSaving && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>Saving to Google Sheets...</Text>
            </View>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.buttonText}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex:1},
  message: {textAlign: "center", marginTop:20},
  camera: {flex:1},
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center"
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  }
});

export default QRScanner;



















