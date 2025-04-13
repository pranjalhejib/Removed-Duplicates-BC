import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import QRScanner from "./QRScanner";
import HomeScreen from "./HomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: "Inventory Management",
          }}
        />
        <Stack.Screen 
          name="QRScanner" 
          component={QRScanner}
          options={{
            title: "Scan Product QR/Barcode",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}





















