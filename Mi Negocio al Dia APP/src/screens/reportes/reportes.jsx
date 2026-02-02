import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { styles } from './reportes.styles.jsx'; 

export const ReportesScreen = ({ navigation }) => {
    const [productos, setProductos] = useState([]);
    const [gananciaTotal, setGananciaTotal] = useState(0);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            cargarDatos();
        });
        return unsubscribe;
    }, [navigation]);

    const cargarDatos = async () => {
        try {
            const res = await fetch('http://192.168.1.18:3000/producto');
            const data = await res.json();
            setProductos(data);

            const total = data.reduce((acc, p) => acc + ((p.precio_venta - p.precio_compra) * p.cantidad), 0);
            setGananciaTotal(total);
        } catch (e) {
            console.error("Error en reportes:", e);
        }
    };

    // --- FUNCIÓN CORREGIDA (UNA SOLA DECLARACIÓN) ---
    const getImagenUrl = (ruta) => {
        if (!ruta) return null;
        // Limpiamos barras de Windows y barras iniciales en un solo paso
        const rutaLimpia = ruta.replace(/\\/g, '/').replace(/^\/+/, ''); 
        return `http://192.168.1.18:3000/${rutaLimpia}`;
    };

    const stockBajo = productos.filter(p => p.cantidad <= (p.stock_minimo || 15));

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>📊 Reportes de Negocio</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.gananciaCard}>
                    <Text style={styles.gananciaLabel}>Ganancia Estimada Inventario:</Text>
                    <Text style={styles.gananciaValue}>${gananciaTotal.toFixed(2)}</Text>
                </View>

                <Text style={styles.sectionTitle}>📈 Reportes y Alertas</Text>
                
                {stockBajo.length > 0 && (
                    <View>
                        <Text style={styles.alertTitle}>⚠️ ATENCIÓN: STOCK BAJO</Text>
                        {stockBajo.map(item => (
                            <View key={item.id} style={styles.alertCard}>
                                <Text style={styles.alertName}>{item.nombre}</Text>
                                <Text style={styles.alertQty}>Quedan: {item.cantidad} unidades</Text>
                            </View>
                        ))}
                    </View>
                )}

                <Text style={styles.sectionTitle}>Productos disponibles</Text>
                {productos.map(item => (
                    <View key={item.id} style={styles.productCard}>
                        {/* CONTENEDOR DE IMAGEN */}
                        <View style={styles.imagePlaceholder}>
                            <Image 
                                source={item.imagen ? { uri: getImagenUrl(item.imagen) } : require('../../../assets/logo.png')} 
                                style={styles.img} 
                                resizeMode="cover"
                            />
                        </View>

                        <View style={styles.info}>
                            <Text style={styles.prodName}>{item.nombre}</Text>
                            <Text style={styles.prodPrice}>Precio: ${item.precio_venta}</Text>
                            <Text style={styles.prodStock}>Stock actual: {item.cantidad}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <TouchableOpacity 
                style={styles.btnCrear} 
                onPress={() => navigation.navigate("ProductoForm")}
            >
                <Text style={styles.btnCrearText}>CREAR PRODUCTO</Text>
            </TouchableOpacity>
        </View>
    );
};