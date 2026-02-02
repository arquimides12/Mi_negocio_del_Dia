import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from "./home.styles"; 

export const HomeScreen = ({ navigation, route }) => {
    // Manejo de parámetros de usuario con valores por defecto
    const { nombreEmpresa = "Mi Negocio", nombreCompleto = "Usuario" } = route.params || {};

    return (
        <ScrollView style={styles.container} bounces={false}>
            {/* ENCABEZADO ESTILO FIGMA */}
            <View style={styles.header}>
                <Image 
                    source={require('../../../assets/inicio.png')} 
                    style={styles.userIcon} 
                />
                
                <View style={styles.textGroup}>
                    <Text style={styles.companyNameText}>{nombreEmpresa}</Text>
                    <Text style={styles.userNameText}>{nombreCompleto}</Text>
                </View>

                <Image 
                    source={require('../../../assets/logo.png')} 
                    style={styles.logoTop} 
                />
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Acceso Administrativo</Text>
                <Text style={styles.description}>
                    Mi negocio al día te comparte las opciones más vitales para la administración de tu negocio.
                </Text>

                <View style={styles.menuGrid}>
                    {/* BOTÓN CAJA VENDER */}
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => navigation.navigate("Venta")}
                    >
                        <Text style={styles.menuLabel}>Caja vender</Text>
                        <Image source={require('../../../assets/cajaVender.png')} style={styles.menuImage} />
                    </TouchableOpacity>

                    {/* BOTÓN INVENTARIO (CORREGIDO) */}
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => navigation.navigate("Inventario")}
                    >
                        <Text style={styles.menuLabel}>Gestionar Inventario</Text>
                        <Image source={require('../../../assets/inventario.png')} style={styles.menuImage} />
                    </TouchableOpacity>
                </View>

                {/* SECCIÓN REPORTES */}
                <TouchableOpacity 
                    style={styles.reportSection}
                    onPress={() => navigation.navigate("Reportes")}
                >
                    <Text style={styles.menuLabel}>Reportes y Alertas</Text>
                    <Image source={require('../../../assets/reporteAlerta.png')} style={styles.reportImage} />
                </TouchableOpacity>

                <Text style={styles.footerNote}>
                    Recuerda este aplicativo es solo administrativo no generara factura, solo te permitira mantener un orden de lo que sale y entra a tu negocio.
                </Text>
            </View>
        </ScrollView>
    );
};