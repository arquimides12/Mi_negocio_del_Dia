import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  brand: {
    color: '#00E5FF',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 10,
  },
  adminTitle: {
    color: '#00E5FF',
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    color: '#AAA',
    fontSize: 12,
    marginBottom: 15,
  },
  productCard: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  imageContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 5,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  productInfo: {
    marginLeft: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    flex: 1,
  },
  itemTitle: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  itemDetail: {
    color: '#666',
    fontSize: 12,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  navLink: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  cartText: {
    color: '#FFF',
    fontSize: 14,
  },
  totalText: {
    color: '#FFF',
    fontSize: 14,
  },
  btnFinalizar: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});