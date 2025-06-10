import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Importa las pantallas que has creado
import InsertCar from "./insertCar"; // Asegúrate de que la ruta es correcta
import ScanQRCode from "./scanQRCode"; // Asegúrate de que tienes esta pantalla también
import InsertBranchOffice from "./branchOffice"; // Nueva pantalla agregada
import Picker from "./picker";
import ListCars from "./listCar";
import NewUser from "./insertUser";

function HomeScreen() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      const storedRole = await AsyncStorage.getItem("userRole");
      setRole(storedRole);
    };

    checkRole();
  }, []);

  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator>
      {/* Esta pantalla está disponible para todos los roles */}
      <Drawer.Screen name="Scan QR" component={ScanQRCode} />

      {/* Estas pantallas solo están disponibles para los administradores */}
      {role === "admin" && (
        <>
          <Drawer.Screen name="Insert Car" component={InsertCar} />
          <Drawer.Screen name="Cars" component={ListCars} />
          <Drawer.Screen name="New User" component={NewUser} />
          <Drawer.Screen name="Insert Branch Office" component={InsertBranchOffice} />
          <Drawer.Screen name="ChooseBranch" component={Picker} />
          
        </>
      )}
    </Drawer.Navigator>
  );
}



export default HomeScreen;
