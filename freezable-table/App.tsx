import { View, Text, StyleSheet } from 'react-native';
import testData from './testData.js';
import FreezableTable from './FreezableTable';

/**
 interface FreezableTableProps {
  data: object[];           REQUIRED, array of objects with consistent number of keys
  width: number[];            REQUIRED, length = data keys number + 1
  freezeColNum?: number;      OPTIONAL, desc: number of freeze column from left to right, default = 1
  freezeHeaderNum?: number;   OPTIONAL, desc: number of freeze header from top to bottom, default = 1
  
  firstCellContent?: string;   OPTIONAL, desc: text content of the top left corner cell
  capHeader? boolean;         OPTIONAL, if capHeader AND upperHeader are set, header will be UPPERCASE
  upperHeader? boolean;
  innerBorderWidth?: number;
  
  mainContainerStyles?: object;
  freezeRowStyles?: object;
  freezeColStyles?: object;
  bodyStyles?: object;
}
*/
export default function App() {
  return (
    <View style={styles.container}>
      <FreezableTable
        data={testData}
        width={[75, 150, 175, 275, 250, 175]}
        firstCellContent="count"

        freezeHeaderNum={5}
        freezeColNum={2}

        mainContainerStyles={{
          marginVertical: 40,
          borderWidth: 1,
          flex: 1,
        }}
        freezeRowStyles={{
          backgroundColor: 'lightgreen',
        }}
        freezeColStyles={{
          backgroundColor: 'lightpink',
        }}
        bodyStyles={{
          backgroundColor: 'lightyellow',
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
