import { StyleSheet } from 'react-native';

export const FreezableTableMainSheet = StyleSheet.create({
  mainContainer: {
    flex: 1,

    // ! CONDITION: must have to hide freeze column vertical overflow
    overflow: 'hidden',
  },
  headerRowContainer: {
    flexDirection: 'row',
  },
  freezeColTable: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    position: 'absolute',
  },
  scrollableTable: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',

    // ! CONDITION: must have to hide header horizontal overflow
    overflow: 'hidden',
  },
});
