import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from './AuthScreens.styles';

export const AuthScreens = ({ navigation }) => {
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (step === 1) {
            // Splash de 3 segundos
            const timer = setTimeout(() => setStep(2), 3000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    return (
        <View style={styles.container}>
            {/* PANTALLA 1: LOGO Y NOMBRE */}
            {step === 1 && (
                <View style={{ alignItems: 'center' }}>
                    <Image 
                        source={require('../../../assets/logo.png')} 
                        style={styles.logo} 
                    />
                    <Text style={styles.title}>MI NEGOCIO AL DÍA</Text>
                </View>
            )}

            {/* PANTALLA 2: BIENVENIDA Y ACCIÓN */}
            {step === 2 && (
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <Image 
                        source={require('../../../assets/logo.png')} 
                        style={[styles.logo, { width: 80, height: 80 }]} 
                    />
                    <Text style={styles.subtitle}>
                        Felicidades por decidir administrar tu negocio
                    </Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={styles.btnPrimary}
                            onPress={() => console.log("Próximamente Login")}
                        >
                            <Text style={styles.textBtnBlack}>INICIAR SESIÓN</Text>
                        </TouchableOpacity>

                        {/* BOTÓN ACTUALIZADO: Salta al formulario de registro */}
                        <TouchableOpacity 
                            style={styles.btnSecondary}
                            onPress={() => navigation.navigate('Register')}
                        >
                            <Text style={styles.textBtnCyan}>CREAR CUENTA</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};