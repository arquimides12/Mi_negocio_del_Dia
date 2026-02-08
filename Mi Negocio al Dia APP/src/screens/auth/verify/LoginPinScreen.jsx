import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { styles } from './VerifyCode.styles'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LoginPinScreen = ({ navigation }) => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputs = useRef([]);

    const handleInput = (text, index) => {
        const newCode = [...code];
        newCode[index] = text.slice(-1);
        setCode(newCode);
        if (text && index < 5) inputs.current[index + 1].focus();
    };

    // --- FUNCIÓN ACTUALIZADA (PASO 1) ---
    const verificarPinLogin = async () => {
        const pinCompleto = code.join('');
        if (pinCompleto.length < 6) return Alert.alert("Error", "Ingresa los 6 dígitos");

        try {
            const response = await fetch('http://192.168.1.18:3000/auth/verificar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigoPin: pinCompleto }),
            });

            const data = await response.json();
            console.log("Respuesta del servidor en Login:", data); 

            if (data.success) {
                // Buscador de ID para asegurar compatibilidad con tu base de datos
                const idParaGuardar = data.user.id || data.user.usuarioId;

                if (idParaGuardar) {
                    // Guardamos el ID como String para que AsyncStorage no falle
                    await AsyncStorage.setItem('usuarioId', idParaGuardar.toString());
                    await AsyncStorage.setItem('nombreEmpresa', data.user.nombreEmpresa || '');
                    
                    console.log("ID guardado correctamente:", idParaGuardar);
                    navigation.replace('Home');
                } else {
                    Alert.alert("Error Crítico", "El servidor no envió el ID del usuario.");
                }
            } else {
                Alert.alert("PIN Incorrecto", "El código ingresado no es válido.");
            }
        } catch (error) {
            console.error("Error en login:", error);
            Alert.alert("Error", "No se pudo conectar al servidor.");
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../../../assets/logo.png')} style={styles.logoSmall} />
            
            <Text style={styles.title}>¡Bienvenido de nuevo!</Text>
            <Text style={styles.subtitle}>Ingresa tu PIN de 6 dígitos para iniciar sesión</Text>

            <View style={styles.codeContainer}>
                {code.map((digit, index) => (
                    <TextInput
                        key={index}
                        style={styles.codeInput}
                        keyboardType="numeric"
                        maxLength={1}
                        onChangeText={(text) => handleInput(text, index)}
                        ref={(el) => (inputs.current[index] = el)}
                        value={digit}
                    />
                ))}
            </View>

            <TouchableOpacity style={styles.btnSiguiente} onPress={verificarPinLogin}>
                <Text style={styles.textSiguiente}>ENTRAR</Text>
            </TouchableOpacity>
        </View>
    );
};