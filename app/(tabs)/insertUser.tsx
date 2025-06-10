import React, { useState } from "react";
import { TextInput, Button, View, Text, StyleSheet } from "react-native";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import bcrypt from "bcryptjs"; // Importamos bcryptjs para encriptar la contraseña

const AddUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  const handleAddUser = async () => {
    try {
      // Validación básica
      if (!username || !password || !role) {
        setMessage("Todos los campos son obligatorios.");
        return;
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10); // 10 es el número de saltos (puedes ajustarlo)

      // Agregar el nuevo usuario a la colección "users" con la contraseña encriptada
      const docRef = await addDoc(collection(db, "user"), {
        username,
        password: hashedPassword, // Almacenamos la contraseña encriptada
        role,
      });

      setMessage("Usuario agregado correctamente.");
      // Limpiar los campos
      setUsername("");
      setPassword("");
      setRole("");
    } catch (error) {
      setMessage("Error al agregar el usuario.");
      console.error("Error al agregar el usuario: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Usuario</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Role"
        value={role}
        onChangeText={setRole}
        style={styles.input}
        placeholderTextColor="#888"
      />
      <View style={styles.button}>
        <Button title="Agregar Usuario" onPress={handleAddUser} color="#6200EE" />
      </View>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#F5F5F5", // Fondo blanco
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#FFF", // Fondo blanco de los inputs
    color: "#333", // Color de texto en los inputs
  },
  button: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#6200EE", // Color del botón lila
  },
  buttonText: {
    color: "#FFF", // Texto blanco del botón
    fontSize: 16,
    fontWeight: "600",
  },
  message: {
    marginTop: 10,
    color: "#333",
    textAlign: "center",
  },
});

export default AddUser;
