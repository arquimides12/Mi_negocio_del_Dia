import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        paddingHorizontal: 30,
        paddingTop: 80,
        alignItems: 'center',
    },
    logoSmall: {
        width: 60,
        height: 60,
        marginBottom: 40,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        color: '#FFFFFF',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 40,
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 40,
    },
    codeInput: {
        backgroundColor: '#FFFFFF',
        width: 45,
        height: 50,
        borderRadius: 5,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
    },
    btnSiguiente: {
        marginTop: 20,
    },
    textSiguiente: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
    }
});