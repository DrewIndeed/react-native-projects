import React from 'react';
import { Text, Pressable, PressableProps } from 'react-native';

const PressableText = (props: PressableProps & { text: string }) => {
    return (
        <Pressable {...props}>
            <Text style={{ textDecorationLine: 'underline' }}>
                {props.text}
            </Text>
        </Pressable>
    );
};

export default PressableText;
