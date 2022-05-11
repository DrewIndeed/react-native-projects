import { StyleSheet, View } from 'react-native';
import FreezableTable from './components/FreezableTable';
import data from './data';

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
            key: 'address',
          },
          {
            width: 120,
            header: 'Col 2',
            key: 'phone',
            mergeRequests: [
              {
                row: 2,
                amount: 5,
              },
              {
                row: 12,
                amount: 3,
              },
            ],
          },
          {
            width: 175,
            header: 'Col 3',
            key: 'name',
            mergeRequests: [
              {
                row: 4,
                amount: 5,
              },
            ],
          },
          {
            width: 175,
            header: 'Col 4',
            key: 'country',
          },
        ]}
        cellRenderer={(key: string, value: any, row: any) =>
          // (
          //   <View style={{ borderColor: '#000' }}>
          //     <Text style={{ textAlign: 'center' }}>{value}</Text>
          //   </View>
          // )
          value
        }
        freezeColNum={1}
        freezeRowNum={0}
        
        mainContainerStyles={{
          marginVertical: 48,
          borderWidth: 1,
          flex: 1,
        }}
        firstRowStyles={{
          backgroundColor: 'tomato',
        }}
        firstColStyles={{
          backgroundColor: 'yellow',
        }}
        bodyStyles={{
          backgroundColor: 'lightgreen',
          textAlign: 'center',
        }}

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
