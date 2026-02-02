import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#000', 
        paddingHorizontal: 20, 
        paddingTop: 20 
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 25, 
        marginTop: 10 
    },
    backArrow: { color: '#FFF', fontSize: 24, marginRight: 15 },
    headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    card: { 
        flexDirection: 'row', 
        backgroundColor: '#FFF', 
        borderRadius: 20, 
        padding: 15, 
        marginBottom: 15, 
        alignItems: 'center'
    },
    imagePlaceholder: { 
        width: 70, 
        height: 70, 
        backgroundColor: '#F5F5F5', 
        borderRadius: 15, 
        overflow: 'hidden'
    },
    img: { width: '100%', height: '100%' },
    info: { flex: 1, marginLeft: 15 },
    nombre: { color: '#2C3E50', fontSize: 18, fontWeight: 'bold' },
    stockLabel: { color: '#95A5A6', fontSize: 10 },
    cantidad: { color: '#000', fontSize: 15, fontWeight: 'bold' },
    btnEliminar: { 
        backgroundColor: '#FF5252', 
        paddingVertical: 8, 
        paddingHorizontal: 12, 
        borderRadius: 10 
    },
    btnEliminarText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
    btnNuevo: { 
        backgroundColor: '#4FC3F7', 
        paddingVertical: 16, 
        borderRadius: 15, 
        alignItems: 'center', 
        marginTop: 10 
    },
    btnNuevoText: { color: '#000', fontWeight: 'bold', fontSize: 15 }
});