import { View, Text, StyleSheet } from 'react-native';
import testData from './testData.js';
import FreezableTable from './FreezableTable';

/**
 interface FreezableTableProps {
  data: DataItem[];           REQUIRED, array of objects with consistent number of keys
  width: number[];            REQUIRED, length = data keys number + 1

  firstCellContent?: string;   OPTIONAL, desc: text content of the top left corner cell
  freezeColNum?: number;      OPTIONAL, desc: number of freeze column from left to right, default = 1
  freezeHeaderNum?: number;   OPTIONAL, desc: number of freeze header from top to bottom, default = 1
  
  boldHeader? boolean;
  boldFreezeCol? boolean;
  capHeader? boolean;         OPTIONAL, if capHeader AND upperHeader are set, header will be UPPERCASE
  upperHeader? boolean;

  borderWidth?: number;
  marginTop?: number;
  marginBottom?: number;

  bgColors?: {
    cornerCell?: string;
    header?: string;
    freezeColumn?: string;
    body?: string;
  };

  textColors?: {
    cornerCell?: string;
    header?: string;
    freezeColumn?: string;
    body?: string;
  };
}
*/
export default function App() {
  return (
    <View style={styles.container}>
      <FreezableTable
        data={testData.slice(0, 4)}
        width={[75, 150, 175, 275, 250, 175]}
        freezeHeaderNum={0}
        freezeColNum={0}
        
        mainContainerStyles={{
          marginVertical: 40,
          marginHorizontal: 10,
        }}
        // firstCellContent="count"
        // boldHeader={true}
        // boldFreezeCol={true}
        // capHeader={true}
        // upperHeader={true}

        bgColors={{
          cornerCell: 'cyan',
          header: 'lime',
          freezeColumn: 'lightpink',
          body: 'white',
        }}

        // textColors={{
        //   cornerCell: '#000',
        //   header: '#000',
        //   freezeColumn: '#000',
        //   body: '#000',
        // }}
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
