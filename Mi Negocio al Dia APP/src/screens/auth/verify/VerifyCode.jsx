import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { styles } from './VerifyCode.styles';
// IMPORTANTE: Para guardar el ID en la memoria del teléfono
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export const VerifyCode = ({ route, navigation }) => {
    const { telefono } = route.params || { telefono: 'Desconocido' }; 
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputs = useRef([]);

    const handleInput = (text, index) => {
        const newCode = [...code];
        newCode[index] = text.slice(-1); 
        setCode(newCode);

        if (text && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const verificarPin = async () => {
        const pinCompleto = code.join('');
        
        if (pinCompleto.length < 6) {
            return Alert.alert("Incompleto", "Por favor ingresa los 6 dígitos del código.");
        }

        try {
            const response = await fetch('http://192.168.1.18:3000/auth/verificar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    telefono: telefono, 
                    codigoPin: pinCompleto 
                }),
            });

            const data = await response.json();

            if (data.success) {
                // --- PROCESO DE GUARDADO ---
                // Guardamos el ID (ej: 20) como un String en la memoria
                await AsyncStorage.setItem('usuarioId', data.user.id.toString());
                await AsyncStorage.setItem('nombreEmpresa', data.user.nombreEmpresa);
                await AsyncStorage.setItem('nombreCompleto', data.user.nombreCompleto);

                console.log("Sesión iniciada. ID de Usuario guardado:", data.user.id);

                // Navegamos al Home enviando los datos también por si acaso
                navigation.replace('Home', { 
                    nombreEmpresa: data.user.nombreEmpresa, 
                    nombreCompleto: data.user.nombreCompleto 
                }); 
            } else {
                Alert.alert("Error", data.mensaje || "El código es incorrecto.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error de Conexión", "No se pudo conectar con el servidor. Verifica tu Wi-Fi.");
        }
    };

    return (
        <View style={styles.container}>
            <Image 
                source={require('../../../../assets/logo.png')} 
                style={styles.logoSmall} 
            />
            <Text style={styles.title}>Ingresa tu código</Text>
            <Text style={styles.subtitle}>Enviamos un código de 6 dígitos al {telefono}</Text>

            <View style={styles.codeContainer}>
                {code.map((digit, index) => (
                    <TextInput
                        key={index}
                        style={styles.codeInput}
                        keyboardType="numeric"
                        maxLength={1}
                        onChangeText={(text) => handleInput(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        ref={(el) => (inputs.current[index] = el)}
                        value={digit}
                        selectTextOnFocus={true}
                    />
                ))}
            </View>

            <TouchableOpacity 
                style={styles.btnSiguiente} 
                onPress={verificarPin}
                activeOpacity={0.7}
            >
                <Text style={styles.textSiguiente}>SIGUIENTE</Text>
            </TouchableOpacity>
        </View>
    );
};