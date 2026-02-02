import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
// SOLUCIÓN AL ERROR ROJO: Importación con extensión completa
import { styles } from './inventario.styles.jsx'; 

export const InventarioScreen = ({ navigation }) => {
    const [productos, setProductos] = useState([]);

    // Carga los productos cada vez que la pantalla gana el foco
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            cargarProductos();
        });
        return unsubscribe;
    }, [navigation]);

    const cargarProductos = async () => {
        try {
            // Asegúrate de que tu servidor esté corriendo en esta IP
            const res = await fetch('http://192.168.1.18:3000/producto');
            const data = await res.json();
            setProductos(data);
        } catch (e) {
            console.error("Error cargando inventario:", e);
        }
    };

    const eliminarProducto = (id) => {
        Alert.alert(
            "Eliminar Producto",
            "¿Estás seguro de que deseas eliminar este item del inventario?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            const res = await fetch(`http://192.168.1.18:3000/producto/${id}`, { 
                                method: 'DELETE' 
                            });
                            if (res.ok) {
                                cargarProductos(); // Refresca la lista
                            }
                        } catch (e) { 
                            Alert.alert("Error", "No se pudo eliminar el producto"); 
                        }
                    } 
                }
            ]
        );
    };

    const getImagenUrl = (ruta) => {
        if (!ruta) return null;
        const rutaLimpia = ruta.replace(/\\/g, '/').replace(/^\/+/, '');
        return `http://192.168.1.18:3000/${rutaLimpia}`;
    };

    return (
        <View style={styles.container}>
            {/* Cabecera personalizada */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>📦 Inventario Real</Text>
            </View>

            <FlatList
                data={productos}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.imagePlaceholder}>
                            <Image 
                                source={item.imagen ? { uri: getImagenUrl(item.imagen) } : require('../../../assets/logo.png')} 
                                style={styles.img} 
                                key={item.id} // Ayuda a React a no perder la referencia
                            />
                        </View>
                        
                        <View style={styles.info}>
                            <Text style={styles.nombre}>{item.nombre}</Text>
                            <Text style={styles.stockLabel}>STOCK ACTUAL</Text>
                            <Text style={styles.cantidad}>{item.cantidad} unidades</Text>
                        </View>

                        <TouchableOpacity 
                            style={styles.btnEliminar} 
                            onPress={() => eliminarProducto(item.id)}
                        >
                            <Text style={styles.btnEliminarText}>ELIMINAR</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={{color: '#666', textAlign: 'center', marginTop: 20}}>
                        No hay productos en el inventario.
                    </Text>
                }
            />

            {/* Botones de acción inferior */}
            <TouchableOpacity 
                style={styles.btnNuevo} 
                onPress={() => navigation.navigate("ProductoForm")}
            >
                <Text style={styles.btnNuevoText}>+ AGREGAR NUEVO PRODUCTO</Text>
            </TouchableOpacity>
        </View>
    );
};