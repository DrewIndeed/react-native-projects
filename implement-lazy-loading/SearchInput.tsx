import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export default function SearchInput({
  placeholder,
  onSubmit,
}: {
  placeholder: string;
  onSubmit: any;
}) {
  const [text, setText] = useState<string>('');
  const handleChangeText = (text: string) => setText(text);
  const handleSubmitEditing = () => {
    if (!text) return;
    onSubmit(text);
    setText('');
  }

  return (
    <View style={styles.container}>
      <TextInput
        autoCorrect={false}
        value={text}
        placeholder={placeholder}
        placeholderTextColor="gray"
        underlineColorAndroid="transparent"
        textAlign="center"
        style={styles.textInput}
        clearButtonMode="always"
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmitEditing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textInput: {
    flex: 1,
    fontSize: 20,
    color: '#222',
  },
});
