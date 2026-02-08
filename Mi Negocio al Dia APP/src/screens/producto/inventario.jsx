import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { styles } from './inventario.styles.jsx'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export const InventarioScreen = ({ navigation }) => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            cargarProductos();
        });
        return unsubscribe;
    }, [navigation]);

    const cargarProductos = async () => {
        try {
            const usuarioId = await AsyncStorage.getItem('usuarioId');
            
            if (!usuarioId) {
                console.error("No se encontró el usuarioId");
                return;
            }

            // Usamos la ruta filtrada por usuarioId
            const res = await fetch(`http://192.168.1.18:3000/producto/usuario/${usuarioId}`);
            const data = await res.json();
            setProductos(data);
        } catch (e) {
            console.error("Error cargando inventario:", e);
        }
    };

    // --- FUNCIÓN DE ELIMINACIÓN CORREGIDA ---
    const eliminarProducto = (id) => {
        Alert.alert(
            "Eliminar Producto",
            "¿Estás seguro de que deseas eliminar este item del inventario?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive", 
                    onPress: () => ejecutarEliminacion(id)
                }
            ]
        );
    };

    const ejecutarEliminacion = async (id) => {
        try {
            // 1. Recuperamos el usuarioId de la memoria local
            const usuarioId = await AsyncStorage.getItem('usuarioId');
            
            // 2. Enviamos el DELETE incluyendo el usuarioId como query param (?usuarioId=...)
            const res = await fetch(`http://192.168.1.18:3000/producto/${id}?usuarioId=${usuarioId}`, { 
                method: 'DELETE' 
            });

            if (res.ok) {
                Alert.alert("Éxito", "Producto eliminado correctamente");
                // Filtramos el estado local para borrarlo de la vista sin recargar
                setProductos(prev => prev.filter(p => p.id !== id));
            } else {
                const errorData = await res.json();
                Alert.alert("Error", errorData.mensaje || "No autorizado para eliminar este producto");
            }
        } catch (e) { 
            console.error("Error al eliminar:", e);
            Alert.alert("Error", "Error de conexión al intentar eliminar"); 
        }
    };

    const getImagenUrl = (ruta) => {
        if (!ruta) return null;
        const rutaLimpia = ruta.replace(/\\/g, '/').replace(/^\/+/, '');
        return `http://192.168.1.18:3000/${rutaLimpia}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>📦 Mi Inventario</Text>
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
                                key={item.id}
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
                        No tienes productos registrados.
                    </Text>
                }
            />

            <TouchableOpacity 
                style={styles.btnNuevo} 
                onPress={() => navigation.navigate("ProductoForm")}
            >
                <Text style={styles.btnNuevoText}>+ AGREGAR NUEVO PRODUCTO</Text>
            </TouchableOpacity>
        </View>
    );
};