import React from 'react';
import { Text } from 'react-native';

const MontserratText = (props: Text['props']) => {
    return (
        <Text
            style={{ fontFamily: 'montserrat' }}
            {...props} // or children={props.children}
        />
    );
};

export default MontserratText;
