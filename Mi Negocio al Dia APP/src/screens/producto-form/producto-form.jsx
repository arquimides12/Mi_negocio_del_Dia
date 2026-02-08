import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './producto-form.styles'; 
// IMPORTANTE: Para saber quién es el dueño del nuevo producto
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export const ProductoFormScreen = ({ navigation }) => {
    const [form, setForm] = useState({
        nombre: '',
        precio_compra: '',
        precio_venta: '',
        cantidad: '',
        stock_minimo: '',
        descripcion: ''
    });
    const [imagen, setImagen] = useState(null);

    const seleccionarImagen = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], 
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImagen(result.assets[0].uri);
        }
    };

    const guardarProducto = async () => {
        if (!form.nombre || !form.precio_venta || !form.cantidad) {
            return Alert.alert("Campos vacíos", "El nombre, precio de venta y cantidad son obligatorios.");
        }

        try {
            // 1. Obtenemos el ID del dueño desde el teléfono
            const usuarioId = await AsyncStorage.getItem('usuarioId');
            
            if (!usuarioId) {
                return Alert.alert("Error de sesión", "No se encontró el ID del usuario. Por favor, reingresa con tu PIN.");
            }

            // 2. Preparamos el FormData para el envío
            const formData = new FormData();
            formData.append('nombre', form.nombre);
            formData.append('precio_compra', form.precio_compra || 0);
            formData.append('precio_venta', form.precio_venta);
            formData.append('cantidad', form.cantidad);
            formData.append('stock_minimo', form.stock_minimo || 0);
            formData.append('descripcion', form.descripcion);
            // PASO CLAVE: Adjuntamos el ID del dueño
            formData.append('usuarioId', usuarioId); 

            if (imagen) {
                const filename = imagen.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image`;
                formData.append('imagen', { uri: imagen, name: filename, type });
            }

            // 3. Enviamos al servidor
            const res = await fetch('http://192.168.1.18:3000/producto', {
                method: 'POST',
                body: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.ok) {
                Alert.alert("Éxito", "Producto creado correctamente");
                navigation.goBack(); 
            } else {
                const errorData = await res.json();
                Alert.alert("Error", errorData.mensaje || "No se pudo crear el producto");
            }
        } catch (e) {
            console.error(e);
            Alert.alert("Error de Conexión", "No se pudo alcanzar el servidor.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Nuevo Producto</Text>

            <TouchableOpacity style={styles.imagePicker} onPress={seleccionarImagen}>
                {imagen ? (
                    <Image source={{ uri: imagen }} style={styles.previewImage} />
                ) : (
                    <Text style={styles.imagePickerText}>Seleccionar Imagen</Text>
                )}
            </TouchableOpacity>

            <View>
                <TextInput 
                    style={styles.input} 
                    placeholder="Nombre del producto" 
                    placeholderTextColor="#666"
                    onChangeText={(txt) => setForm({...form, nombre: txt})}
                />

                <View style={styles.row}>
                    <TextInput 
                        style={[styles.input, { width: '48%' }]} 
                        placeholder="Precio Compra" 
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        onChangeText={(txt) => setForm({...form, precio_compra: txt})}
                    />
                    <TextInput 
                        style={[styles.input, { width: '48%' }]} 
                        placeholder="Precio Venta" 
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        onChangeText={(txt) => setForm({...form, precio_venta: txt})}
                    />
                </View>

                <View style={styles.row}>
                    <TextInput 
                        style={[styles.input, { width: '48%' }]} 
                        placeholder="Cantidad inicial" 
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        onChangeText={(txt) => setForm({...form, cantidad: txt})}
                    />
                    <TextInput 
                        style={[styles.input, { width: '48%' }]} 
                        placeholder="Alerta stock mín." 
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        onChangeText={(txt) => setForm({...form, stock_minimo: txt})}
                    />
                </View>

                <TextInput 
                    style={[styles.input, styles.textArea]} 
                    placeholder="Descripción detallada..." 
                    placeholderTextColor="#666"
                    multiline
                    onChangeText={(txt) => setForm({...form, descripcion: txt})}
                />

                <TouchableOpacity style={styles.btnGuardar} onPress={guardarProducto}>
                    <Text style={styles.btnText}>CREAR PRODUCTO</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};