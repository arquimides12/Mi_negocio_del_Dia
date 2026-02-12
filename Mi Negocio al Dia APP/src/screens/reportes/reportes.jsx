import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { styles } from './reportes.styles.jsx'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export const ReportesScreen = ({ navigation }) => {
    const [productos, setProductos] = useState([]);
    const [totales, setTotales] = useState({ capitalInvertido: 0, gananciaEstimada: 0 });

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            cargarDatos();
        });
        return unsubscribe;
    }, [navigation]);

    const cargarDatos = async () => {
        try {
            const usuarioId = await AsyncStorage.getItem('usuarioId');
            const res = await fetch(`http://192.168.1.18:3000/producto/usuario/${usuarioId}`);
            
            if (!res.ok) {
                setProductos([]);
                return;
            }

            const data = await res.json();
            const listaProductos = Array.isArray(data) ? data : [];
            setProductos(listaProductos);

            // --- LÓGICA DE NEGOCIO FILTRADA ---
            // Solo operamos con lo que está 'activo'
            const productosActivos = listaProductos.filter(p => p.estado === 'activo');

            const capital = productosActivos.reduce((total, p) => {
                return total + (parseFloat(p.precio_compra) * parseInt(p.cantidad));
            }, 0);

            const ganancia = productosActivos.reduce((total, p) => {
                return total + ((parseFloat(p.precio_venta) - parseFloat(p.precio_compra)) * parseInt(p.cantidad));
            }, 0);

            setTotales({ capitalInvertido: capital, gananciaEstimada: ganancia });

        } catch (e) {
            console.error("Error en reportes:", e);
            setProductos([]); 
        }
    };

    const getImagenUrl = (ruta) => {
        if (!ruta) return null;
        const rutaLimpia = ruta.replace(/\\/g, '/').replace(/^\/+/, ''); 
        return `http://192.168.1.18:3000/${rutaLimpia}`;
    };

    // --- ALERTAS SOLO PARA PRODUCTOS ACTIVOS ---
    const listaStockBajo = productos.filter(p => {
        const actual = Number(p.cantidad) || 0;
        const minimo = Number(p.stock_minimo) || 0;
        return p.estado === 'activo' && actual <= minimo;
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>📊 Reportes de Negocio</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Cuadro de Ganancia (Ahora basado solo en Activos) */}
                <View style={styles.gananciaCard}>
                    <Text style={styles.gananciaLabel}>Ganancia Estimada Activos:</Text>
                    <Text style={styles.gananciaValue}>${totales.gananciaEstimada.toFixed(2)}</Text>
                    <Text style={[styles.gananciaLabel, {marginTop: 10}]}>Capital Invertido:</Text>
                    <Text style={[styles.gananciaValue, {fontSize: 18}]}>${totales.capitalInvertido.toFixed(2)}</Text>
                </View>

                <Text style={styles.sectionTitle}>📈 Alertas de Reposición</Text>
                
                {listaStockBajo.length > 0 ? (
                    <View>
                        <Text style={styles.alertTitle}>⚠️ ATENCIÓN: COMPRAR PRODUCTOS</Text>
                        {listaStockBajo.map(item => (
                            <View key={item.id} style={styles.alertCard}>
                                <Text style={styles.alertName}>{item.nombre}</Text>
                                <Text style={styles.alertQty}>
                                    Stock Crítico: {item.cantidad} (Mínimo: {item.stock_minimo})
                                </Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text style={{ paddingHorizontal: 20, color: 'gray', fontStyle: 'italic' }}>
                        ✅ Todo en orden. No hay alertas de stock activo.
                    </Text>
                )}

                <Text style={styles.sectionTitle}>Resumen General (Activos)</Text>
                {productos.filter(p => p.estado === 'activo').length > 0 ? (
                    productos.filter(p => p.estado === 'activo').map(item => (
                        <View key={item.id} style={styles.productCard}>
                            <View style={styles.imagePlaceholder}>
                                <Image 
                                    source={item.imagen ? { uri: getImagenUrl(item.imagen) } : require('../../../assets/logo.png')} 
                                    style={styles.img} 
                                    resizeMode="cover"
                                />
                            </View>

                            <View style={styles.info}>
                                <Text style={styles.prodName}>{item.nombre}</Text>
                                <Text style={styles.prodPrice}>P. Venta: ${Number(item.precio_venta).toFixed(2)}</Text>
                                <Text style={styles.prodStock}>Disponibles: {item.cantidad}</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
                        No hay productos activos actualmente.
                    </Text>
                )}
            </ScrollView>

            <TouchableOpacity 
                style={styles.btnCrear} 
                onPress={() => navigation.navigate("ProductoForm")}
            >
                <Text style={styles.btnCrearText}>AGREGAR NUEVO PRODUCTO</Text>
            </TouchableOpacity>
        </View>
    );
};