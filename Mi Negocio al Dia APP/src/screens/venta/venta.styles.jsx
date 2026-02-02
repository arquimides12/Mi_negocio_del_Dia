import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff'
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2c3e50'
    },
    itemProducto: {
        padding: 15,
        backgroundColor: '#fff',
        marginBottom: 8,
        borderRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#eee'
    },
    nombreProd: {
        fontWeight: 'bold',
        fontSize: 16
    },
    detalleProd: {
        color: '#27ae60',
        marginTop: 2
    },
    resumenContainer: {
        backgroundColor: '#f8f9f9',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        borderTopWidth: 2,
        borderTopColor: '#bdc3c7'
    },
    textoCarrito: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5
    },
    totalTexto: {
        fontSize: 24,
        textAlign: 'right',
        color: '#27ae60', // Verde dinero
        fontWeight: 'bold',
        marginVertical: 10
    }
});