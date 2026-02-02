import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { styles } from './RegisterScreen.styles';

export const RegisterScreen = ({ navigation }) => {
    const [form, setForm] = useState({
        nombreCompleto: '',
        telefono: '',
        fechaNacimiento: '', // Formato dd/mm/aaaa
        nombreEmpresa: ''
    });
    const [aceptarTerminos, setAceptarTerminos] = useState(false);

    // Validación de mayoría de edad (18+)
    const esMayorDeEdad = (fechaStr) => {
        const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!regex.test(fechaStr)) return false;
        const [_, dia, mes, anio] = fechaStr.match(regex);
        const fechaNac = new Date(anio, mes - 1, dia);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        if (hoy.getMonth() < fechaNac.getMonth() || (hoy.getMonth() === fechaNac.getMonth() && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }
        return edad >= 18;
    };

    const manejarRegistro = async () => {
        const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        const soloNumeros = /^[0-9]+$/;

        // --- VALIDACIONES PROFESIONALES ---
        if (!soloLetras.test(form.nombreCompleto)) {
            return Alert.alert("Validación", "El nombre solo debe contener letras.");
        }
        if (!soloNumeros.test(form.telefono) || form.telefono.length !== 10) {
            return Alert.alert("Validación", "El teléfono debe tener 10 dígitos numéricos.");
        }
        if (!esMayorDeEdad(form.fechaNacimiento)) {
            return Alert.alert("Acceso Denegado", "Debes ser mayor de edad para registrarte.");
        }
        if (!aceptarTerminos) {
            return Alert.alert("Términos", "Debes aceptar los términos y condiciones.");
        }

        try {
            // USANDO TU IP REAL PARA CONECTAR AL PC
            const response = await fetch('http://192.168.1.18:3000/auth/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (data.success) {
                // Al tener éxito, saltamos a la pantalla del PIN
                navigation.navigate('VerifyCode', { telefono: form.telefono });
            } else {
                Alert.alert("Error", data.message);
            }
        } catch (error) {
            Alert.alert("Error de Conexión", "No se pudo conectar con el servidor. Revisa tu IP.");
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../../../assets/logo.png')} style={styles.logoSmall} />
            
            <TextInput 
                style={styles.input} 
                placeholder="Nombres completos" 
                placeholderTextColor="#999"
                onChangeText={(v) => setForm({...form, nombreCompleto: v})}
            />
            <TextInput 
                style={styles.input} 
                placeholder="Número telefónico (10 dígitos)" 
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={10}
                onChangeText={(v) => setForm({...form, telefono: v})}
            />
            <TextInput 
                style={styles.input} 
                placeholder="Fecha de nacimiento: dd/mm/aaaa" 
                placeholderTextColor="#999"
                onChangeText={(v) => setForm({...form, fechaNacimiento: v})}
            />
            <TextInput 
                style={styles.input} 
                placeholder="Nombre de la empresa" 
                placeholderTextColor="#999"
                onChangeText={(v) => setForm({...form, nombreEmpresa: v})}
            />

            <TouchableOpacity 
                style={styles.row} 
                onPress={() => setAceptarTerminos(!aceptarTerminos)}
            >
                {/* Cuadrito que cambia de color al marcarlo */}
                <View style={[styles.checkbox, { backgroundColor: aceptarTerminos ? '#00FFFF' : '#D9D9D9' }]} />
                <Text style={styles.label}>acepta los terminos y condiciones</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.btnSiguiente, { opacity: aceptarTerminos ? 1 : 0.5 }]} 
                onPress={manejarRegistro}
                disabled={!aceptarTerminos}
            >
                <Text style={styles.textSiguiente}>SIGUIENTE</Text>
            </TouchableOpacity>
        </View>
    );
};