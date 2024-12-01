
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CustomToast({ text1, text2, ...rest }) {
  return (
    <View style={styles.container}>
      {text1 ? <Text style={styles.text1}>{text1}</Text> : null}
      {text2 ? <Text style={styles.text2}>{text2}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    paddingVertical: 20, 
    paddingHorizontal: 20,
    backgroundColor: '#21d411',
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
  text1: {
    fontSize: 24, //otsikko
    fontWeight: 'bold',
    color: '#fff',
  },
  text2: {
    fontSize: 20, //  alaotsikko
    color: '#fff',
    marginTop: 5,
  },
});
