import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { styles } from './caja.styles';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export const CajaScreen = ({ navigation }) => {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);

    // Se ejecuta cada vez que la pantalla entra en foco
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            cargarProductos(); 
        });
        return unsubscribe;
    }, [navigation]);

    // --- FUNCIÓN DINÁMICA DE CARGA ---
    const cargarProductos = async () => {
        try {
            // 1. Recuperamos el ID que el Login guardó
            const idGuardado = await AsyncStorage.getItem('usuarioId');
            
            // Log para que verifiques en tu terminal de VS Code
            console.log("DEBUG: El ID recuperado de AsyncStorage es:", idGuardado);

            if (!idGuardado || idGuardado === 'undefined' || idGuardado === 'null') {
                console.error("ERROR: No hay un ID de usuario válido. Revisa el Login.");
                return;
            }

            // 2. Construimos la URL dinámica (Ej: http://192.168.1.18:3000/producto/usuario/20)
            const url = `http://192.168.1.18:3000/producto/usuario/${idGuardado}`;
            console.log("Caja consultando a:", url);

            const res = await fetch(url);
            
            if (!res.ok) {
                console.error("Error del servidor en Caja:", res.status);
                return;
            }

            const data = await res.json();
            console.log("DEBUG: Productos recibidos:", data.length);
            
            // 3. Seteamos los productos
            setProductos(Array.isArray(data) ? data : []);

        } catch (e) { 
            console.error("Error de conexión en Caja:", e); 
            Alert.alert("Error", "No se pudo conectar con el servidor");
        }
    };

    // Formatea la URL de la imagen para que React Native la entienda
    const getImagenUrl = (ruta) => {
        if (!ruta) return null;
        const rutaLimpia = ruta.replace(/\\/g, '/').replace(/^\/+/, ''); 
        return `http://192.168.1.18:3000/${rutaLimpia}`;
    };

    return (
        <View style={styles.container}>
            {/* Cabecera */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.title}>← Caja / Vender</Text>
                </TouchableOpacity>
                <Text style={styles.brand}>Juanle</Text>
            </View>
            <View style={styles.divider} />

            <Text style={styles.adminTitle}>Acceso Administrativo</Text>
            <Text style={styles.label}>Seleccionar Productos:</Text>

            {/* Lista de productos dinámica */}
            <FlatList
                data={productos}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.productCard} 
                        onPress={() => setCarrito([...carrito, item])}
                    >
                        <View style={styles.imageContainer}>
                            <Image 
                                source={item.imagen ? { uri: getImagenUrl(item.imagen) } : require('../../../assets/logo.png')} 
                                style={styles.productImage} 
                            />
                        </View>
                        <View style={styles.productInfo}>
                            <Text style={styles.itemTitle}>{item.nombre}</Text>
                            <Text style={styles.itemDetail}>valor ${Number(item.precio_venta).toFixed(2)}</Text>
                            <Text style={styles.itemDetail}>{item.descripcion || "Sin descripción"}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>No hay productos para este usuario.</Text>}
            />

            {/* Enlaces de navegación */}
            <View style={styles.navRow}>
                <TouchableOpacity onPress={() => navigation.navigate("ProductoForm")}>
                    <Text style={styles.navLink}>CREAR PRODUCTOS</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Inventario")}>
                    <Text style={styles.navLink}>INVENTARIO</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.divider} />

            {/* Footer con carrito y total */}
            <View style={styles.footerRow}>
                <Text style={styles.cartText}>Carrito ({carrito.length} items)</Text>
                <Text style={styles.totalText}>total: $ {carrito.reduce((a, b) => a + Number(b.precio_venta), 0).toFixed(2)}</Text>
            </View>

            <TouchableOpacity 
                style={styles.btnFinalizar} 
                onPress={() => Alert.alert("Éxito", "Venta realizada con éxito")}
            >
                <Text style={styles.btnText}>Finalizar Ventas</Text>
            </TouchableOpacity>
        </View>
    );
};