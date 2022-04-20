import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, View, ScrollView } from 'react-native';

const testData = [
    {
        name: 'Adele Welch',
        phone: '(171) 728-6134',
        email: 'a.sollicitudin@hotmail.ca',
        address: '308-5457 Aliquet Road',
        country: 'Pakistan',
    },
    {
        name: 'Jane Rogers',
        phone: '(328) 784-5216',
        email: 'enim@protonmail.net',
        address: 'Ap #906-5694 Tempus, Avenue',
        country: 'United Kingdom',
    },
    {
        name: 'Edward Clemons',
        phone: '1-466-844-4088',
        email: 'sapien@google.couk',
        address: '7012 Faucibus Rd.',
        country: 'Nigeria',
    },
    {
        name: 'Hasad Rhodes',
        phone: '1-873-705-4222',
        email: 'a.felis.ullamcorper@google.ca',
        address: '9673 Suspendisse Ave',
        country: 'Sweden',
    },
    {
        name: 'Kaye Mcdaniel',
        phone: '(724) 466-4451',
        email: 'ornare@protonmail.net',
        address: '255-6551 Tincidunt Rd.',
        country: 'Chile',
    },
    {
        name: 'Wilma Rodriquez',
        phone: '1-868-863-1156',
        email: 'sed.consequat.auctor@protonmail.com',
        address: '955-8452 Suscipit, Street',
        country: 'Spain',
    },
    {
        name: 'Kato King',
        phone: '(353) 215-3365',
        email: 'lobortis.tellus.justo@aol.couk',
        address: 'Ap #323-9130 Id, Rd.',
        country: 'Australia',
    },
    {
        name: 'Tate West',
        phone: '(846) 658-3892',
        email: 'est@yahoo.ca',
        address: '658-8965 Placerat Ave',
        country: 'Belgium',
    },
    {
        name: 'Dennis Whitehead',
        phone: '(766) 189-9789',
        email: 'cursus.non@yahoo.ca',
        address: 'Ap #249-6096 Interdum. Rd.',
        country: 'South Africa',
    },
    {
        name: 'Burton Rodriquez',
        phone: '(271) 377-1289',
        email: 'dictum.sapien@aol.com',
        address: 'Ap #810-6158 Nulla. Street',
        country: 'Philippines',
    },
    {
        name: 'Timon Graham',
        phone: '(732) 689-8442',
        email: 'nullam@yahoo.couk',
        address: '4748 Non St.',
        country: 'Russian Federation',
    },
    {
        name: 'Cleo Ellis',
        phone: '(230) 985-3374',
        email: 'risus.morbi@protonmail.org',
        address: '719-9002 Fusce Ave',
        country: 'Singapore',
    },
    {
        name: 'Dustin Austin',
        phone: '(473) 642-1322',
        email: 'non.quam@protonmail.couk',
        address: 'Ap #496-410 Felis St.',
        country: 'Spain',
    },
    {
        name: 'Jolene Hood',
        phone: '1-295-706-1037',
        email: 'at@hotmail.org',
        address: '6949 Erat St.',
        country: 'South Africa',
    },
    {
        name: 'Karina Vaughan',
        phone: '(453) 301-2587',
        email: 'tristique.pellentesque.tellus@hotmail.edu',
        address: 'P.O. Box 380, 2816 Feugiat. St.',
        country: 'United Kingdom',
    },
    {
        name: 'Leroy Travis',
        phone: '(543) 788-0552',
        email: 'cursus.et.eros@aol.com',
        address: 'P.O. Box 905, 7727 Urna. St.',
        country: 'Brazil',
    },
    {
        name: 'Brianna Wilkinson',
        phone: '1-849-688-2236',
        email: 'posuere@icloud.ca',
        address: 'Ap #849-9951 Odio Avenue',
        country: 'Spain',
    },
    {
        name: 'Melvin Rivers',
        phone: '(784) 176-8664',
        email: 'erat.sed.nunc@google.org',
        address: 'Ap #862-294 Ultrices Avenue',
        country: 'Russian Federation',
    },
    {
        name: 'Yoshio Nash',
        phone: '(861) 627-1675',
        email: 'ut.tincidunt@hotmail.ca',
        address: '171-4794 Vestibulum Av.',
        country: 'France',
    },
    {
        name: 'Rebekah Tanner',
        phone: '1-815-308-1296',
        email: 'fames.ac.turpis@outlook.net',
        address: 'Ap #539-9967 Aliquam Rd.',
        country: 'Germany',
    },
    {
        name: 'Elmo Bennett',
        phone: '1-440-675-5666',
        email: 'ultrices.vivamus.rhoncus@yahoo.ca',
        address: '3331 Blandit Rd.',
        country: 'Poland',
    },
];

const getKeyNums = (data: object[]) => Object.keys(data[0]).length;

const COLS_NUM = getKeyNums(testData); // ! CONDITION: test data items must have consistent number of keys

const ROWS_NUM = testData.length;

export default function App() {
    const headerOffsetX = useRef(new Animated.Value(0)).current;
    const freezeColOffsetY = useRef(new Animated.Value(0)).current;

    const HeaderRow = () => {
        const headerCells: any[] = [];
        for (let i = 0; i < COLS_NUM; i++)
            headerCells.push(
                <Text
                    style={{
                        borderWidth: 1,
                        padding: 10,
                        width: 150,
                        backgroundColor: 'lime',
                        fontWeight: 'bold',
                    }}
                    key={`HEADER ${i}`}
                >
                    {Object.keys(testData[0])[i].toUpperCase()}
                </Text>
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
        if (extra) {
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

            for (let i = 0; i < ROWS_NUM; i++)
                headerCells.push(
                    <Text
                        style={{
                            borderWidth: 1,
                            padding: 10,
                            width: 150,
                            backgroundColor: extra ? 'purple' : '#fff',
                            color: '#fff',
                        }}
                        key={`DATA ${i + 1}`}
                    >{`DATA ${i + 1}`}</Text>
                );
        } else {
            for (let i = 0; i < ROWS_NUM; i++)
                headerCells.push(
                    <Text
                        style={{
                            borderWidth: 1,
                            padding: 10,
                            width: 150,
                            backgroundColor: extra ? 'purple' : '#fff',
                        }}
                        key={`DATA ${i + 1}`}
                    >{`DATA ${i + 1} An`}</Text>
                );
        }

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
    for (let i = 0; i < COLS_NUM; i++) cols.push(<Column key={i} />);

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
                        style={{ paddingBottom: 16 }} // ! TO SCROLL CVERTICALLY COMPLETELY
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
