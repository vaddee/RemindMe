import { StyleSheet } from 'react-native';

const buttonStyles = StyleSheet.create({
  button: {
    backgroundColor: '#1E90FF', // Sininen väri
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10, 
  },
  buttonText: {
    color: '#FFFFFF', // Valkoinen tekstiväri
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default buttonStyles;
