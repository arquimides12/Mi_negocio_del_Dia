import { StyleSheet, Dimensions } from "react-native";

// Detectamos el ancho de la pantalla actual
const { width } = Dimensions.get('window');
const isWeb = width > 600; 

export const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        padding: 10,
        // Si es web, centra el contenido y dale un ancho máximo
        // Si es móvil, ocupa el 100%
        alignSelf: isWeb ? 'center' : 'stretch',
        width: isWeb ? 500 : '100%', 
        // Añadimos una sombra suave para que en web parezca una app real
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isWeb ? 0.1 : 0,
        shadowRadius: 10,
        elevation: isWeb ? 5 : 0,
    }
});