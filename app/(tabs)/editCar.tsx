import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

// Define el tipo para el auto
type Car = {
  carImage: string;
  brand: string;
  model: string;
};

const EditCar = () => {
  // En una ruta dinámica, el parámetro se llama según el nombre del archivo. Aquí se espera "car".
  const { car } = useLocalSearchParams<{ car: string }>();
  console.log("Parámetro recibido:", car);

  // Estados para el formulario
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [carImage, setCarImage] = useState("");

  useEffect(() => {
    if (car) {
      try {
        const decoded = decodeURIComponent(car);
        const parsedCar: Car = JSON.parse(decoded);
        console.log("Objeto decodificado:", parsedCar);
        setBrand(parsedCar.brand);
        setModel(parsedCar.model);
        setCarImage(parsedCar.carImage);
      } catch (error) {
        console.error("Error al decodificar 'car':", error);
      }
    }
  }, [car]);

  const handleSave = () => {
    console.log("Guardando cambios:", { brand, model, carImage });
    // Aquí implementarías la lógica para actualizar el auto en la base de datos
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Vehículo</Text>
      <TextInput
        style={styles.input}
        value={brand}
        onChangeText={setBrand}
        placeholder="Marca"
      />
      <TextInput
        style={styles.input}
        value={model}
        onChangeText={setModel}
        placeholder="Modelo"
      />
      <TextInput
        style={styles.input}
        value={carImage}
        onChangeText={setCarImage}
        placeholder="Imagen URL"
      />
      <Button title="Guardar" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    fontSize: 16,
  },
});

export default EditCar;
