import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, View, ScrollView } from 'react-native';

export default function App() {
    const headerOffsetX = useRef(new Animated.Value(0)).current;
    const freezeColOffsetY = useRef(new Animated.Value(0)).current;

    const HeaderRow = () => {
        const headerCells: any[] = [];
        for (let i = 0; i < 10; i++)
            headerCells.push(
                <Text
                    style={{
                        borderWidth: 1,
                        padding: 10,
                        width: 150,
                        backgroundColor: 'lime',
                    }}
                    key={`HEADER ${i}`}
                >{`HEADER ${i}`}</Text>
            );
        return (
            <Animated.View
                style={[
                    styles.box,
                    {
                        transform: [
                            {
                                translateX: Animated.multiply(
                                    headerOffsetX,
                                    new Animated.Value(-1)
                                ),
                            },
                        ],
                    },
                ]}
            >
                {headerCells}
            </Animated.View>
        );
    };

    const Column = ({ extra }: { extra?: boolean }) => {
        const headerCells: any[] = [];
        if (extra)
            headerCells.push(
                <Text
                    style={{
                        borderWidth: 1,
                        opacity: 0,
                        padding: 10,
                        width: 150,
                    }}
                    key={`HOLDER NHA`}
                >{`HOLDER NHA`}</Text>
            );
        for (let i = 0; i < 30; i++)
            headerCells.push(
                <Text
                    style={{
                        borderWidth: 1,
                        padding: 10,
                        width: 150,
                        backgroundColor: extra ? 'purple' : '#fff',
                    }}
                    key={`DATA ${i}`}
                >{`DATA ${i}`}</Text>
            );
        return extra ? (
            <Animated.View
                style={[
                    styles.box2,
                    {
                        transform: [
                            {
                                translateY: Animated.multiply(
                                    freezeColOffsetY,
                                    new Animated.Value(-1)
                                ),
                            },
                        ],
                    },
                ]}
            >
                {headerCells}
            </Animated.View>
        ) : (
            <View style={styles.box2}>{headerCells}</View>
        );
    };

    const cols = [];
    for (let i = 0; i < 10; i++) cols.push(<Column key={i} />);

    return (
        <View style={styles.container2}>
            <Column extra />
            <View style={styles.container}>
                <HeaderRow />
                <ScrollView
                    bounces={false}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: {
                                        y: freezeColOffsetY,
                                    },
                                },
                            },
                        ],
                        { useNativeDriver: false }
                    )}
                >
                    <ScrollView
                        bounces={false}
                        scrollEventThrottle={16}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        onScroll={Animated.event(
                            [
                                {
                                    nativeEvent: {
                                        contentOffset: {
                                            x: headerOffsetX,
                                        },
                                    },
                                },
                            ],
                            { useNativeDriver: false }
                        )}
                    >
                        {cols}
                    </ScrollView>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container2: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 40,
        overflow: 'hidden',
    },
    box: {
        flexDirection: 'row',
    },
    box2: {
        flexDirection: 'column',
    },
});
