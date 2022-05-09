import { View, StyleSheet, Text } from 'react-native';
import data from './data';
import FreezableTable from './components/FreezableTable';

export default function App() {
  return (
    <View style={styles.container}>
      <FreezableTable
        data={data}
        defaultWidth={150}
        columns={[
          {
            width: 120,
            header: 'Col 1',
            key: 'name',
            mergeRequests: [
              [2, 4],
              [10, 15],
            ],
          },
          {
            width: 120,
            header: 'Col 2',
            key: 'country',
            mergeRequests: [[5, 10]],
          },
          {
            width: 175,
            header: 'Col 3',
            key: 'address',
            mergeRequests: [[0, 2]],
          },
          {
            width: 175,
            header: 'Col 4',
            key: 'phone',
          },
        ]}
        cellRenderer={(key: string, value: any, row: any) =>
          // <View style={{ borderColor: '#000' }}>
          //   <Text style={{ textAlign: 'center' }}>{value}</Text>
          // </View>
          value
        }
        freezeColNum={1}
        // freezeRowNum={4}
        mainContainerStyles={{
          marginVertical: 48,
          borderWidth: 1,
          flex: 1,
        }}
        // firstRowStyles={{
        //   backgroundColor: 'tomato',
        // }}
        // firstColStyles={{
        //   backgroundColor: 'yellow',
        //   textAlign: 'center',
        // }}
        // bodyStyles={{
        //   backgroundColor: 'lightgreen',
        //   textAlign: 'center',
        // }}

        // capHeader={true}
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
