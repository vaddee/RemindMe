import { StyleSheet } from 'react-native';

const modalStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 128, 0.4)', // Sininen läpinäkyvä tausta
  },
  modalContainer: {
    width: '85%',
    padding: 25,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366', // Tumma sininen
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    color: '#003366', // Tumma sininen
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 10,
    borderRadius: 8,
    width: '100%',
  },
  button: {
    backgroundColor: '#007BFF', // Kirkas sininen
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff', // Valkoinen teksti
  },
  cancelButton: {
    backgroundColor: 'grey', // Harmaa peruutuspainikkeelle
  },
});

export default modalStyles;
