import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#000', 
        padding: 20 
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 20, 
        marginTop: 10 
    },
    backArrow: { 
        color: '#FFF', 
        fontSize: 24, 
        marginRight: 15 
    },
    headerTitle: { 
        color: '#FFF', 
        fontSize: 20, 
        fontWeight: 'bold' 
    },

    // Cuadro de Ganancia (El negro de arriba con letras azules)
    gananciaCard: {
        backgroundColor: '#1A1A1A',
        padding: 25,
        borderRadius: 20,
        marginBottom: 30,
    },
    gananciaLabel: { 
        color: '#4FC3F7', 
        fontSize: 16, 
        marginBottom: 10 
    },
    gananciaValue: { 
        color: '#FFF', 
        fontSize: 40, 
        fontWeight: 'bold' 
    },

    sectionTitle: { 
        color: '#4FC3F7', 
        fontSize: 18, 
        marginVertical: 15 
    },
    
    // Tarjeta de Alerta Stock Bajo (Borde rojo)
    alertTitle: { 
        color: '#FF5252', 
        fontWeight: 'bold', 
        marginBottom: 10 
    },
    alertCard: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FF5252',
        marginBottom: 10
    },
    alertName: { 
        color: '#FF5252', 
        fontSize: 20, 
        fontWeight: 'bold' 
    },
    alertQty: { 
        color: '#666', 
        fontSize: 16 
    },

    // Tarjeta Blanca de Producto
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 20,
        marginBottom: 15,
        alignItems: 'center'
    },

    // --- ESTILOS DE LA IMAGEN ---
    imagePlaceholder: { 
        width: 75, 
        height: 75, 
        backgroundColor: '#F0F0F0', 
        borderRadius: 12, 
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    img: { 
        width: '100%', 
        height: '100%',
        borderRadius: 12
    },
    // ----------------------------

    info: { 
        marginLeft: 15,
        flex: 1 
    },
    prodName: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#333' 
    },
    prodPrice: { 
        color: '#666', 
        fontSize: 14,
        marginTop: 2
    },
    prodStock: { 
        color: '#888', 
        fontSize: 12,
        marginTop: 2
    },

    // Botón azul de abajo
    btnCrear: {
        backgroundColor: '#4FC3F7',
        padding: 18,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20
    },
    btnCrearText: { 
        color: '#000', 
        fontWeight: 'bold',
        fontSize: 16
    }
});