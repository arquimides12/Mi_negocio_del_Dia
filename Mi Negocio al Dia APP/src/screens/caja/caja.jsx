import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { styles } from './caja.styles';

export const CajaScreen = ({ navigation }) => {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            cargarProductos();
        });
        return unsubscribe;
    }, [navigation]);

    const cargarProductos = async () => {
        try {
            const res = await fetch('http://192.168.1.18:3000/producto');
            const data = await res.json();
            setProductos(data);
        } catch (e) { console.error(e); }
    };

    const getImagenUrl = (ruta) => {
        if (!ruta) return null;
        const rutaLimpia = ruta.replace(/^\/+/, ''); 
        return `http://192.168.1.18:3000/${rutaLimpia}`;
    };

    return (
        <View style={styles.container}>
            {/* Header Único - Estilo Figma */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.title}>← Caja / Vender</Text>
                </TouchableOpacity>
                <Text style={styles.brand}>Juanle</Text>
            </View>
            <View style={styles.divider} />

            <Text style={styles.adminTitle}>Acceso Administrativo</Text>
            <Text style={styles.label}>Seleccionar Productos:</Text>

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
                            <Text style={styles.itemDetail}>valor {item.precio_venta}</Text>
                            <Text style={styles.itemDetail}>{item.descripcion || "es un producto"}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />

            {/* Enlaces de Navegación */}
            <View style={styles.navRow}>
                <TouchableOpacity onPress={() => navigation.navigate("ProductoForm")}>
                    <Text style={styles.navLink}>CREAR PRODUCTOS</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Inventario")}>
                    <Text style={styles.navLink}>INVENTARIO</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.divider} />

            {/* Footer */}
            <View style={styles.footerRow}>
                <Text style={styles.cartText}>Carrito ({carrito.length} items)</Text>
                <Text style={styles.totalText}>total: $ {carrito.reduce((a, b) => a + b.precio_venta, 0).toFixed(2)}</Text>
            </View>

            <TouchableOpacity 
                style={styles.btnFinalizar} 
                onPress={() => Alert.alert("Éxito", "Venta realizada")}
            >
                <Text style={styles.btnText}>Finalizar Ventas</Text>
            </TouchableOpacity>
        </View>
    );
};