import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        paddingHorizontal: 30,
        paddingTop: 60,
    },
    logoSmall: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 40,
    },
    input: {
        backgroundColor: '#FFFFFF',
        height: 45,
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 14,
        color: '#000000',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 40,
    },
    checkbox: {
        width: 40,
        height: 40,
        backgroundColor: '#D9D9D9',
        marginRight: 15,
    },
    label: {
        color: '#FFFFFF',
        fontSize: 14,
        flexShrink: 1,
    },
    btnSiguiente: {
        alignItems: 'center',
        marginTop: 10,
    },
    textSiguiente: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
    }
    // Se eliminó lineBottom
});