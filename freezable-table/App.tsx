import { View, StyleSheet } from 'react-native';
import testData from './testData.js';
import FreezableTable from './FreezableTable';

/**
 interface FreezableTableProps {
  data: object[];           REQUIRED, array of objects with consistent number of keys
  width: number[];            REQUIRED, length = data keys number + 1
  freezeColNum?: number;      OPTIONAL, desc: number of freeze column from left to right, default = 1
  freezeHeaderNum?: number;   OPTIONAL, desc: number of freeze header from top to bottom, default = 1

  mainContainerStyles?: object;
  freezeRowStyles?: object;
  freezeColStyles?: object;
  bodyStyles?: object;
  
  capHeader? boolean;         OPTIONAL, if capHeader AND upperHeader are set, header will be UPPERCASE
  upperHeader? boolean;
  innerBorderWidth?: number;
}
*/
export default function App() {
  return (
    <View style={styles.container}>
      <FreezableTable
        data={testData}
        defaultWidth={150}
        width={[150, 175, 275, 300, 175]}
        headers={['col 1', 'col 2', 'col 3', 'col 4', 'col 5']}
        freezeColNum={1}
        freezeHeaderNum={2}
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
