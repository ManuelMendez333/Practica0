import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { ToastContainer, toast } from 'react-toastify'; // Importa ToastContainer y toast
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de Toastify
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, updateDoc } from "firebase/firestore";
import QRCode from "react-native-qrcode-svg";
import html2canvas from "html2canvas";

const InsertVehicle = () => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [fabricationYear, setFabricationYear] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [color, setColor] = useState("");
  const [details, setDetails] = useState("");
  const [branchOfficeID, setBranchOfficeID] = useState("");
  const [userID, setUserID] = useState(""); // Aquí guardamos el userID
  const [carImage, setCarImage] = useState("");
  const [vehicleID, setVehicleID] = useState("");
  const [views, setViews] = useState("0");
  const [state, setState] = useState("1");
  
  const qrRef = useRef(null);

  useEffect(() => {
    const fetchBranchOffice = async () => {
      const branch = await AsyncStorage.getItem("selectedBranchOffice");
      if (branch) {
        setBranchOfficeID(branch);
      }
    };

    const fetchUserID = async () => {
      const userID = await AsyncStorage.getItem("userID"); // Obtener el userID del almacenamiento
      console.log("userID desde AsyncStorage:", userID); // Verifica que el valor sea el esperado
      if (userID) {
        setUserID(userID);
      }
    };

    fetchBranchOffice();
    fetchUserID();
  }, []);

  const handleSubmit = async () => {
    if (!brand || !model || !price || !stock || !carImage) {
      toast.error("Por favor, completa los campos obligatorios.", { position: "bottom-center" }); // Usando toast centrado
      return;
    }

  // Validaciones para valores no válidos
  if (Number(price) <= 0) {
    toast.error("El precio debe ser mayor que 0.", { position: "bottom-center" });
    return;
  }

  if (Number(stock) <= 0) {
    toast.error("El stock debe ser mayor que 0.", { position: "bottom-center" });
    return;
  }

  // Validación de año de fabricación
  if (fabricationYear && (Number(fabricationYear) < 1900 || Number(fabricationYear) > new Date().getFullYear() || isNaN(Number(fabricationYear)))) {
    toast.error("El año de fabricación no es válido.", { position: "bottom-center" });
    return;
  }

  if (color && !/^[A-Za-z\s]+$/.test(color)) {
    toast.error("El color solo puede contener letras y espacios.", { position: "bottom-center" });
    return;
  }

  // Validación de detalles (longitud máxima)
  if (details && details.length > 500) {
    toast.error("Los detalles no pueden exceder los 500 caracteres.", { position: "bottom-center" });
    return;
  }


  

    const vehicleData = {
      brand,
      model,
      fabricationYear: fabricationYear || null,
      price: Number(price),
      stock: Number(stock),
      color: color || null,
      details: details || null,
      carImage: carImage || null,
      branchOfficeID: branchOfficeID || null,
      userID, // Aquí asignamos el userID
      views: Number(views),
      state: Number(state),
      createdAt: new Date(),
    };

    try {
      const vehicleRef = collection(db, "vehicle");
      const docRef = await addDoc(vehicleRef, vehicleData);
      setVehicleID(docRef.id);
      await AsyncStorage.setItem("vehicleId", docRef.id);

      const qrUrl = `https://bddconcesionaria.web.app/mi/${docRef.id}`;

      await updateDoc(docRef, { imgQr: qrUrl });

      toast.success("Vehículo creado correctamente", { position: "bottom-center" }); // Usando toast centrado

      setBrand("");
      setModel("");
      setFabricationYear("");
      setPrice("");
      setStock("");
      setColor("");
      setDetails("");
      setCarImage("");
      setBranchOfficeID("");
      setViews("0");
      setState("1")
    } catch (error) {
      console.error("Error:", error);
      toast.error("Hubo un problema al crear el vehículo", { position: "bottom-center" }); // Usando toast centrado
    }
  };

  const downloadQR = () => {
    if (qrRef.current) {
      html2canvas(qrRef.current, { scale: 3 }).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `QR_${model || "Vehiculo"}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Insertar Vehículo</Text>
        <Text style={styles.label}>Marca</Text>
        <TextInput style={styles.input} value={brand} onChangeText={setBrand} placeholder="Ej: Toyota" />

        <Text style={styles.label}>Modelo</Text>
        <TextInput style={styles.input} value={model} onChangeText={setModel} placeholder="Ej: Corolla" />

        <Text style={styles.label}>Año de fabricación</Text>
        <TextInput style={styles.input} value={fabricationYear} onChangeText={setFabricationYear} placeholder="Ej: 2020" keyboardType="numeric" />

        <Text style={styles.label}>Precio</Text>
        <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="Ej: 20000" keyboardType="numeric" />

        <Text style={styles.label}>Stock</Text>
        <TextInput style={styles.input} value={stock} onChangeText={setStock} placeholder="Ej: 5" keyboardType="numeric" />

        <Text style={styles.label}>Color</Text>
        <TextInput style={styles.input} value={color} onChangeText={setColor} placeholder="Ej: Rojo" />

        <Text style={styles.label}>Detalles</Text>
        <TextInput style={[styles.input, { height: 80 }]} value={details} onChangeText={setDetails} placeholder="Ej: Versión deportiva, interior de cuero..." multiline />

        <Text style={styles.label}>URL de la imagen</Text>
        <TextInput style={styles.input} value={carImage} onChangeText={setCarImage} placeholder="Ej: https://tuservidor.com/imagen.jpg" />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Crear Vehículo</Text>
        </TouchableOpacity>

        {vehicleID ? (
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <Text style={styles.qrTitle}>QR del Vehículo</Text>
            <div ref={qrRef}>
              <QRCode value={`https://bddconcesionaria.web.app/mi/${vehicleID}`} size={200} />
            </div>
            <TouchableOpacity style={styles.button} onPress={downloadQR}>
              <Text style={styles.buttonText}>Descargar QR </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
      <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar /> {/* Toasts centrados en el medio de la pantalla */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F5F5" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333", textAlign: "center", marginTop: 20 },
  label: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 5, marginLeft: 5 },
  input: { width: "100%", height: 40, borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 15, backgroundColor: "#fff" },
  button: { backgroundColor: "#6200EE", padding: 15, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18 },
  qrTitle: { fontSize: 18, marginBottom: 10 },
});

export default InsertVehicle;
