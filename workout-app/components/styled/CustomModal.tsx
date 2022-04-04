import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal as NativeModal } from 'react-native';
import PressableText from './PressableText';

// Activator is just a HAVE NOT IMPLEMENTED name
const CustomModal = ({ activator: Activator }: any) => {
  const [isModalVisible, setModalVisible] = useState(false);
  return (
    <View>
      <NativeModal
        visible={isModalVisible}
        transparent={false}
        animationType="fade"
      >
        <View style={styles.centerView}>
          <Text>Hello from Modal!</Text>
          <PressableText onPress={() => setModalVisible(false)} text="Close" />
        </View>
      </NativeModal>
      {Activator ? (
        <Activator />
      ) : (
        <PressableText
          onPress={() => setModalVisible(true)}
          text="Default Open Text"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomModal;
