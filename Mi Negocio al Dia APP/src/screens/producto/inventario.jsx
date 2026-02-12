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
            if (!usuarioId) return;

            const res = await fetch(`http://192.168.1.18:3000/producto/usuario/${usuarioId}`);
            const data = await res.json();
            setProductos(data);
        } catch (e) {
            console.error("Error cargando inventario:", e);
        }
    };

    const cambiarEstado = async (id, nuevoEstado) => {
        try {
            const res = await fetch(`http://192.168.1.18:3000/producto/actualizar-estado/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: nuevoEstado })
            });

            if (res.ok) {
                // Actualización instantánea en la interfaz
                setProductos(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
            } else {
                Alert.alert("Error", "No se pudo actualizar el estado");
            }
        } catch (e) {
            console.error("Error al cambiar estado:", e);
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
                renderItem={({ item }) => {
                    const esActivo = item.estado === 'activo';

                    return (
                        <View style={[
                            styles.card, 
                            !esActivo && { opacity: 0.4, backgroundColor: '#e0e0e0' } // Efecto opaco/gris si es pasivo
                        ]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.imagePlaceholder}>
                                    <Image 
                                        source={item.imagen ? { uri: getImagenUrl(item.imagen) } : require('../../../assets/logo.png')} 
                                        style={styles.img} 
                                    />
                                </View>
                                
                                <View style={styles.info}>
                                    <Text style={styles.nombre}>{item.nombre}</Text>
                                    <Text style={styles.stockLabel}>STOCK ACTUAL</Text>
                                    <Text style={styles.cantidad}>{item.cantidad} unidades</Text>

                                    {/* BOTÓN INTEGRADO: Debajo de las unidades */}
                                    <TouchableOpacity 
                                        onPress={() => cambiarEstado(item.id, esActivo ? 'pasivo' : 'activo')}
                                        style={{
                                            backgroundColor: esActivo ? '#00A8C1' : '#666',
                                            paddingVertical: 6,
                                            paddingHorizontal: 20,
                                            borderRadius: 15,
                                            marginTop: 8,
                                            alignSelf: 'flex-start',
                                            elevation: esActivo ? 2 : 0
                                        }}>
                                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13 }}>
                                            {esActivo ? 'Pasivo' : 'Activo'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    );
                }}
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