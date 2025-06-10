import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView
} from "react-native";
import { db } from "../../firebase/firebaseConfig"; 
import { collection, addDoc } from "firebase/firestore";

const InsertBranchOffice = () => {
  // Estados para cada uno de los campos
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [telephone, setTelephone] = useState<string>("");
  const [emailContact, setEmailContact] = useState<string>("");

  // Función para enviar los datos a Firestore
  const handleSubmit = async () => {
    // Validación básica de campos obligatorios
    if (!name || !address || !latitude || !longitude || !telephone) {
      Alert.alert("Error", "Por favor, completa todos los campos obligatorios.");
      return;
    }

    // Crear objeto con los datos de la sucursal
    const branchOfficeData = {
      name,
      address,
      latitude: Number(latitude),
      longitude: Number(longitude),
      telephone: Number(telephone),
      emailContact: emailContact || null,
      createdAt: new Date()
    };

    try {
      // Referencia a la colección "branchOffice" en Firestore
      const branchOfficeRef = collection(db, "branchOffice");
      // Agregar documento a la colección
      const docRef = await addDoc(branchOfficeRef, branchOfficeData);

      Alert.alert("Éxito", `Sucursal creada con ID: ${docRef.id}`);

      // Limpieza de campos
      setName("");
      setAddress("");
      setLatitude("");
      setLongitude("");
      setTelephone("");
      setEmailContact("");
    } catch (error) {
      console.error("Error al crear la sucursal:", error);
      Alert.alert("Error", "Hubo un problema al crear la sucursal");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Insertar Sucursal</Text>

        {/* Campo: Nombre */}
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ej: Sucursal Principal"
        />

        {/* Campo: Dirección */}
        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Ej: Calle 123, Ciudad"
        />

        {/* Campo: Latitud */}
        <Text style={styles.label}>Latitud</Text>
        <TextInput
          style={styles.input}
          value={latitude}
          onChangeText={setLatitude}
          placeholder="Ej: 19.4326"
          keyboardType="numeric"
        />

        {/* Campo: Longitud */}
        <Text style={styles.label}>Longitud</Text>
        <TextInput
          style={styles.input}
          value={longitude}
          onChangeText={setLongitude}
          placeholder="Ej: -99.1332"
          keyboardType="numeric"
        />

        {/* Campo: Teléfono */}
        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={telephone}
          onChangeText={setTelephone}
          placeholder="Ej: 5555555555"
          keyboardType="numeric"
        />

        {/* Campo: Correo de contacto (opcional) */}
        <Text style={styles.label}>Correo de contacto</Text>
        <TextInput
          style={styles.input}
          value={emailContact}
          onChangeText={setEmailContact}
          placeholder="Ej: contacto@sucursal.com"
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Crear Sucursal</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InsertBranchOffice;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5"
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
    marginTop: 20
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
    marginLeft: 5
  },
  input: {
    width: "100%",
    minHeight: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#FFF",
    color: "#333"
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#6200EE",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600"
  }
});
