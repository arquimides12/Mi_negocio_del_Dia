import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { styles } from './reportes.styles.jsx'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

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
            // 1. Obtenemos el ID del usuario
            const usuarioId = await AsyncStorage.getItem('usuarioId');
            
            // 2. CORREGIDO: Usamos la nueva ruta que agregamos al backend
            // Es /producto/usuario/ seguido del ID
            const res = await fetch(`http://192.168.1.18:3000/producto/usuario/${usuarioId}`);
            
            // Verificación de seguridad para no intentar leer HTML como JSON
            if (!res.ok) {
                console.error("Error en respuesta del servidor:", res.status);
                setProductos([]);
                return;
            }

            const data = await res.json();
            
            // 3. Validamos que data sea una lista
            const listaProductos = Array.isArray(data) ? data : [];
            setProductos(listaProductos);

            // 4. Calculamos ganancia con seguridad
            const total = listaProductos.reduce((acc, p) => {
                const precioVenta = Number(p.precio_venta) || 0;
                const precioCompra = Number(p.precio_compra) || 0;
                const cantidad = Number(p.cantidad) || 0;
                return acc + ((precioVenta - precioCompra) * cantidad);
            }, 0);
            
            setGananciaTotal(total);
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

    const stockBajo = (productos || []).filter(p => (Number(p.cantidad) || 0) <= (Number(p.stock_minimo) || 15));

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
                
                {stockBajo.length > 0 ? (
                    <View>
                        <Text style={styles.alertTitle}>⚠️ ATENCIÓN: STOCK BAJO</Text>
                        {stockBajo.map(item => (
                            <View key={item.id} style={styles.alertCard}>
                                <Text style={styles.alertName}>{item.nombre}</Text>
                                <Text style={styles.alertQty}>Quedan: {item.cantidad} unidades</Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text style={{ paddingHorizontal: 20, color: 'gray' }}>No hay alertas de stock.</Text>
                )}

                <Text style={styles.sectionTitle}>Resumen de Productos</Text>
                {productos.length > 0 ? (
                    productos.map(item => (
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
                                <Text style={styles.prodPrice}>Precio: ${Number(item.precio_venta || 0).toFixed(2)}</Text>
                                <Text style={styles.prodStock}>Stock actual: {item.cantidad}</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>No hay productos registrados.</Text>
                )}
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