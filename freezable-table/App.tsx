import { View, StyleSheet } from 'react-native';
import testData from './testData.js';
import FreezableTable from './FreezableTable';

export default function App() {
  return (
    <View style={styles.container}>
      <FreezableTable
        data={testData}
        defaultWidth={150}
        columns={[
          {
            width: 150,
            header: 'Col 1',
            key: 'country',
          },
          {
            width: 175,
            header: 'Col 2',
            key: 'phone',
          },
          {
            width: 175,
            header: 'Col 3',
            key: 'name',
          },
        ]}
        cellRenderer={(key, value, row) => {
          console.log('cellrenderer', key, value, row);
          return value;
        }}
        freezeColNum={0}
        freezeRowNum={0}
        mainContainerStyles={{
          marginVertical: 40,
          borderWidth: 1,
          flex: 1,
        }}
        firstRowStyles={{
          backgroundColor: 'lightgreen',
        }}
        firstColStyles={{
          backgroundColor: 'lightpink',
        }}
        bodyStyles={{
          backgroundColor: 'lightyellow',
        }}
        capHeader={true}
        // upperHeader={true}
        // innerBorderWidth={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 10,
  },
});
