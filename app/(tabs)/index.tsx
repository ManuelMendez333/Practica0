import React, { useState } from "react";
import { View, TextInput, Alert, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import bcrypt from 'bcryptjs';  // Import bcryptjs
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Por favor, ingresa usuario y contraseña");
      return;
    }

    try {
      const usersRef = collection(db, "user");  // Ensure the collection is 'users'
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const userId = querySnapshot.docs[0].id;

        // Compare the entered password with the hashed password from Firebase
        const passwordMatch = bcrypt.compareSync(password, userData.password);

        if (passwordMatch) {
          await AsyncStorage.setItem("userRole", userData.role);
          await AsyncStorage.setItem("userId", userId);
          Alert.alert("Éxito", `Bienvenido, ${userData.role}`);
          router.push("/home");
        } else {
          Alert.alert("Error", "Contraseña incorrecta");
        }
      } else {
        Alert.alert("Error", "Usuario no encontrado");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Alert.alert("Error", "Hubo un problema al iniciar sesión");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio de Sesión</Text>

      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Ingrese su usuario"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Ingrese su contraseña"
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#FFF",
    color: "#333",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#6200EE", // Color del botón
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFF", // Texto blanco del botón
    fontSize: 16,
    fontWeight: "600",
  },
});

export default LoginScreen;

