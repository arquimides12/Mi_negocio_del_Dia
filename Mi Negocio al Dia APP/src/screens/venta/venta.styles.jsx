import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Fondo negro como el resto de la app
        padding: 20
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#00E5FF', // Cian neón
        marginTop: 10
    },
    itemProducto: {
        padding: 18,
        backgroundColor: '#1A1A1A', // Gris muy oscuro
        marginBottom: 12,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#333',
        elevation: 5
    },
    nombreProd: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#FFF'
    },
    detalleProd: {
        color: '#4FC3F7', // Azul claro para el precio
        marginTop: 5,
        fontSize: 14
    },
    resumenContainer: {
        backgroundColor: '#1A1A1A',
        padding: 20,
        borderRadius: 20,
        marginTop: 10,
        borderTopWidth: 2,
        borderTopColor: '#00E5FF'
    },
    textoCarrito: {
        fontSize: 16,
        color: '#BBB',
        fontWeight: 'bold',
        marginBottom: 5
    },
    totalTexto: {
        fontSize: 32,
        textAlign: 'right',
        color: '#FFF',
        fontWeight: 'bold',
        marginVertical: 10
    },
    btnFinalizar: {
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 5
    }
});