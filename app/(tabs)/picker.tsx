import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { db } from "../../firebase/firebaseConfig"; // Asegúrate de tener la conexión a Firebase importada
import { collection, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InsertCar from "./insertCar";

const SelectBranchOffice = ({ navigation }) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [branchOffices, setBranchOffices] = useState([]);

  useEffect(() => {
    const fetchBranchOffices = async () => {
      try {
        const branchOfficeRef = collection(db, "branchOffice");
        const querySnapshot = await getDocs(branchOfficeRef);
        const offices = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setBranchOffices(offices);
      } catch (error) {
        console.error("Error al obtener las sucursales: ", error);
      }
    };

    fetchBranchOffices();
  }, []);

  const handleConfirm = async () => {
    if (selectedValue) {
      await AsyncStorage.setItem("selectedBranchOffice", selectedValue); 
      alert("Sucursal guardada");
    } else {
      alert("Por favor, selecciona una sucursal.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selecciona una sucursal:</Text>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => setSelectedValue(itemValue)}
        style={styles.picker}
      >
        {branchOffices.map((branch) => (
          <Picker.Item key={branch.id} label={branch.name} value={branch.id} />
        ))}
      </Picker>
      <Text style={styles.label}></Text>
      <Text style={styles.label}></Text>
      <Text style={styles.label}></Text>
      <Text style={styles.label}></Text>
      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirmar Sucursal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#2c3e50",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 15,
    color: "#ecf0f1",
  },
  picker: {
    height: 50,
    width: "80%",
    backgroundColor: "#34495e",
    borderRadius: 5,
    color: "#ecf0f1",
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#6200EE",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default SelectBranchOffice;
