import React, { FunctionComponent, useState } from 'react';
import { View, Text, StyleSheet, Modal as NativeModal } from 'react-native';
import PressableText from './PressableText';

type ModalProps = {
    // ? makes activator an optional parameter
    activator?: FunctionComponent<{
        handleOpen: () => void;
    }>;
    children: FunctionComponent<{
        handleOpen: () => void;
        handleClose: () => void;
    }>;
};

// Activator is just a HAVE NOT IMPLEMENTED name
const CustomModal = ({ activator: Activator, children }: ModalProps) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const handleOpen = () => setModalVisible(true);
    const handleClose = () => setModalVisible(false);

    return (
        <View>
            <NativeModal
                visible={isModalVisible}
                transparent={false}
                animationType="fade"
            >
                <View style={styles.centerView}>
                    <View style={styles.contentView}>
                        {children({ handleOpen, handleClose })}
                    </View>
                    <PressableText onPress={handleClose} text="Close" />
                </View>
            </NativeModal>
            {Activator ? (
                <Activator handleOpen={handleOpen} />
            ) : (
                <PressableText onPress={handleOpen} text="Default Open Text" />
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
    contentView: {
        marginBottom: 20,
    },
});

export default CustomModal;
