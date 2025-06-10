import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, Button } from "react-native";
import { db } from "../../firebase/firebaseConfig"; // Asegúrate de tener tu configuración de Firebase
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { useRouter } from "expo-router"; // Usamos useRouter para la navegación

// Define el tipo para los autos
type Car = {
  carImage: string;
  brand: string;
  model: string;
};

const ListCar = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Función para obtener todos los autos desde Firebase
    const fetchCars = async () => {
      const querySnapshot = await getDocs(collection(db, "vehicle"));
      const carsList: Car[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        // Validamos que existan los campos
        if (data.carImage && data.brand && data.model) {
          const car: Car = {
            carImage: data.carImage,
            brand: data.brand,
            model: data.model,
          };
          carsList.push(car);
        }
      });

      setCars(carsList);
    };

    fetchCars();
  }, []);

  // Al presionar "Editar", convertimos el objeto a string y lo pasamos en la ruta dinámica
  const handleEdit = (car: Car) => {
    const carString = encodeURIComponent(JSON.stringify(car));
    // Pasamos el parámetro a través del query string de la URL
    router.push(`/(tabs)/editCar?car=${carString}`);
  };

  const renderCar = ({ item }: { item: Car }) => (
    <View style={styles.carItem}>
      {item.carImage ? (
        <Image source={{ uri: item.carImage }} style={styles.carImage} />
      ) : (
        <Text>No hay imagen disponible</Text>
      )}
      <Text style={styles.carText}>Marca: {item.brand}</Text>
      <Text style={styles.carText}>Modelo: {item.model}</Text>
      <Button title="Editar" onPress={() => handleEdit(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Vehículos</Text>
      <FlatList
        data={cars}
        renderItem={renderCar}
        keyExtractor={(_, index) => index.toString()}
      />
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
  carItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 5,
  },
  carImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  carText: {
    fontSize: 16,
    color: "#333",
  },
});

export default ListCar;
