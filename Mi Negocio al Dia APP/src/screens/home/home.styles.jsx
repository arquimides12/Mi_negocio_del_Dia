import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Fondo negro total
    },
    header: {
        flexDirection: 'row', // Alinea horizontalmente: Avatar - Nombres - Logo
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: '#333',
    },
    userIcon: {
        width: 45,
        height: 45,
        borderRadius: 22.5, // Hace que la imagen inicio.png sea circular
        backgroundColor: '#1A1A1A', // Fondo por si la imagen tarda en cargar
    },
    textGroup: {
        flex: 1, // Empuja el contenido para que el logo quede a la derecha
        marginLeft: 15, // Espacio entre el avatar y el texto
    },
    companyNameText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    userNameText: {
        color: '#00E5FF', // Cyan para el nombre del dueño
        fontSize: 14,
    },
    logoTop: {
        width: 45,
        height: 45,
        resizeMode: 'contain',
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        color: '#00E5FF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        color: '#FFF',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 25,
    },
    menuGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    menuItem: {
        width: '45%',
        alignItems: 'center',
    },
    menuLabel: {
        color: '#FFF',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
    menuImage: {
        width: 130,
        height: 130,
        borderRadius: 65, // Círculos perfectos para los iconos de menú
    },
    reportSection: {
        alignItems: 'center',
        marginTop: 30,
    },
    reportImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    footerNote: {
        color: '#777',
        fontSize: 11,
        textAlign: 'center',
        marginTop: 40,
        paddingHorizontal: 10,
    }
});