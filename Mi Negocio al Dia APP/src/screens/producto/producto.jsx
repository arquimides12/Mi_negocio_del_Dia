import { FlatList, Alert } from "react-native";
import { Container } from "../../components/container/container";
import { useCallback, useState } from "react";
import { Card } from "../../screens/card/card";
import { ENDPOINTS } from "../../config/api";
import { useFocusEffect } from "@react-navigation/native";
import { styles } from "./producto.styles"; 

export const ProductoScreen = ({ navigation }) => {
    const [productos, setProductos] = useState([]);

    const getProductos = async () => {
        try {
            const response = await fetch(ENDPOINTS.PRODUCTOS);
            const json = await response.json();
            setProductos(json);
        } catch (error) {
            console.log("Error al leer productos:", error);
        }
    }

    const deleteProducto = async (id) => {
        Alert.alert("Confirmar", "¿Eliminar este producto?", [
            { text: "Cancelar", style: "cancel" },
            { 
                text: "Eliminar", 
                onPress: async () => {
                    try {
                        const response = await fetch(`${ENDPOINTS.PRODUCTOS}/${id}`, {
                            method: 'DELETE'
                        });
                        if (response.ok) {
                            getProductos(); 
                        }
                    } catch (error) {
                        console.log("Error:", error);
                    }
                }
            }
        ]);
    }

    useFocusEffect(
        useCallback(() => {
            getProductos();
        }, [])
    );

    return (
        <Container>
            <FlatList
                style={styles.container}
                data={productos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    // Dentro del renderItem de producto.jsx
                        <Card 
                            id={item.id}
                            nombre={item.nombre}
                            precio={item.precio_venta} // <--- NUEVO
                            cantidad={item.cantidad} 
                            onDelete={() => deleteProducto(item.id)}
                            onUpdate={() => navigation.navigate("ProductoForm", { producto: item })}
                        />
                )}
            />
        </Container>
    );
}