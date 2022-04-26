// import { View, StyleSheet } from 'react-native';
import testData from './testData.js';
import FreezableTable from './FreezableTable';

export default function App() {
  return (
    <FreezableTable
      data={testData}
      firstCellContent="count"
      width={[100, 175, 175, 275, 250, 175]}
      freezeHeaderNum={1}
      freezeColNum={1}
      marginTop={40}
      bgColors={{
        cornerCell: 'cyan',
        header: 'lime',
        freezeColumn: 'lightpink',
        body: 'white',
      }}
      textColors={{
        cornerCell: '#000',
        header: '#000',
        freezeColumn: '#000',
        body: '#000',
      }}
    />
  );
}
