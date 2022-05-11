// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import _ from 'lodash';
import { FreezableTableProps } from './types';

//capitalize all words of a targetStr.
export function capitalizeWords(targetStr: string) {
  return targetStr.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
}

// get a limited number of obj data
export function sliceDataObj(targetObj: object, columnKeys: string[]) {
  // create new obj container after filtering
  let filterObjContainer: { [key: string]: string } = {};

  // populate new obj data
  columnKeys.map((colKey: string) => {
    filterObjContainer[colKey] = targetObj[colKey as keyof object];
  });

  // return new obj
  return filterObjContainer;
}

// filter our text related style
export const getTextRelatedStyles = (styleObjsArr: any) => {
  // supported styles array
  const SUPPORTED_STYLES: string[] = [
    'background',
    'color',
    'font',
    'text',
    'line',
    'letter',
  ].sort();

  // merge function to merge array of objects
  let merge = _.spread(_.partial(_.merge, {}));
  let rawMergeStyleObj = merge(styleObjsArr);

  // set the attributes that are no supported to null -> keep the ones that are relevant
  Object.entries(rawMergeStyleObj).forEach((entry) => {
    if (
      SUPPORTED_STYLES.every((suppStyleKey) => !entry[0].includes(suppStyleKey))
    ) {
      rawMergeStyleObj[entry[0]] = null;
    }
  });

  // return filtered style object
  return rawMergeStyleObj;
};

export const readColMergeRequest = (colIdx: number, requestArr: any) => {
  // generate coordinates from row and amount of merge cell
  const _generateCoordinates = (
    colIdx: number,
    rowIdx: number,
    amount: number
  ) => {
    const coordinateContainer = [];
    for (let i = rowIdx; i <= rowIdx + amount; i++)
      coordinateContainer.push([colIdx, i]);
    return coordinateContainer;
  };

  const allCoorsOfCol: any = [];
  requestArr.forEach((rq: any) => {
    const coors = _generateCoordinates(colIdx, rq.row, rq.amount);
    allCoorsOfCol.push(...coors);
  });

  return allCoorsOfCol;
};

// generate compulsory style based on conditioms
export const generateCompulsoryStyles = (
  compulsoryStyleSeed: any,
  hidden: any,
  isDataRow: any
) => {
  // ! destructure seed
  const {
    freezeColNum,
    innerBorderWidth,
    defaultWidth,
    firstRowStyles,
    firstColStyles,
    bodyStyles,
    widths,
  } = compulsoryStyleSeed;

  // ! compulsory style containers for first and following cells
  let commonCellsStyles: any = {
    borderWidth: innerBorderWidth || 1,
    backgroundColor: '#fff',
    padding: 10,
  };
  const headerCellsStyles: any = {
    otherCells: {
      style: {
        ...commonCellsStyles,
        opacity: hidden ? 0 : 1,
      },
    },
    firstCell: {
      style: {
        ...commonCellsStyles,
        opacity: hidden ? 1 : 0,
      },
    },
  };

  // ! generate must-have style array for cells
  return (rowOrder: number, idx: number) => [
    (freezeColNum ? idx < freezeColNum : idx < 1)
      ? headerCellsStyles.firstCell.style
      : headerCellsStyles.otherCells.style,
    { width: widths[idx] || defaultWidth },

    !isDataRow && rowOrder === 0 && firstRowStyles,
    !isDataRow && rowOrder > 0 && idx === 0 && firstColStyles,
    !isDataRow && rowOrder > 0 && idx > 0 && bodyStyles,

    isDataRow && rowOrder >= 0 && idx === 0 && firstColStyles,
    isDataRow && rowOrder >= 0 && idx > 0 && bodyStyles,
  ];
};

// error handling for freezable table component
export function allErrorHandling({
  data,
  defaultWidth,
  columns,
  freezeColNum,
  freezeRowNum,
  mainContainerStyles,
  firstRowStyles,
  firstColStyles,
  bodyStyles,
}: FreezableTableProps) {
  // ERROR HANDLING: required props
  if (!data || data.length === 0) {
    throw new Error('[FreezableTable Error]: There is no data to render');
  } else {
    if (defaultWidth < 0)
      throw new Error(
        '[FreezableTable Error]: defaultWidth must be greater than 0'
      );

    if (columns.length <= 0)
      throw new Error(
        '[FreezableTable Error]: There must be at least 1 column specified'
      );

    // ERROR HANDLING: freeze row and col number props
    if (
      freezeColNum &&
      (freezeColNum > Object.keys(data[0]).length + 1 || freezeColNum < 0)
    )
      throw new Error(
        '[FreezableTable Error]: Value must be greater or equal to 0 and less than data keys number for freezeColNum, otherwise leave blank with default value as 0'
      );

    if (freezeRowNum && (freezeRowNum > data.length || freezeRowNum < 0))
      throw new Error(
        '[FreezableTable Error]: Value must be greater or equal to 0 and less than data row number for freezeRowNum, otherwise leave blank with default value as 0'
      );

    // ERROR HANDLING: styles containers
    // --- main container ---
    if (mainContainerStyles && Object.keys(mainContainerStyles).length > 0) {
      // supported styles array for mainContainerStyles
      const SUPPORTED_STYLES: string[] = [
        'margin',
        'border',
        'background',
        'width',
        'height',
        'flex',
        'shadow',
        'zIndex',
      ].sort();

      let isValid: boolean = false;

      Object.keys(mainContainerStyles).map((styleKey) => {
        isValid = false;

        for (let i = 0; i < SUPPORTED_STYLES.length; i++) {
          const element = SUPPORTED_STYLES[i];
          if (styleKey.toLowerCase().includes(element.toLowerCase())) {
            isValid = true;
            break;
          }
        }
      });

      if (!isValid) {
        throw new Error(
          `[FreezableTable Error]: mainContainerStyles only supports styles relating to: ${SUPPORTED_STYLES.join(
            ', '
          )}`
        );
      }

      if (Object.keys(mainContainerStyles).includes('width')) {
        if (!Object.keys(mainContainerStyles).includes('height'))
          throw new Error(
            `[FreezableTable Error]: both 'width' and 'height' must present if one of them is defined in mainContainerStyles`
          );
      } else if (Object.keys(mainContainerStyles).includes('height')) {
        if (!Object.keys(mainContainerStyles).includes('width'))
          throw new Error(
            `[FreezableTable Error]: both 'width' and 'height' must present if one of them is defined in mainContainerStyles`
          );
      } else {
        if (!Object.keys(mainContainerStyles).includes('flex')) {
          throw new Error(
            `[FreezableTable Error]: 'flex: 1' must present if none of 'width' and 'height' is defined in mainContainerStyles`
          );
        }
      }
    }

    // --- cells container ---
    const validateCellStyles = (styleObj: object) => {
      // supported styles array for mainContainerStyles
      const SUPPORTED_STYLES: string[] = [
        'background',
        'align',
        'justify',
        'border',
        'color',
        'font',
        'text',
        'line',
        'letter',
        'padding',
        'shadow',
      ].sort();
      let isValid: boolean = false;

      Object.keys(styleObj).map((styleKey) => {
        isValid = false;

        for (let i = 0; i < SUPPORTED_STYLES.length; i++) {
          const element = SUPPORTED_STYLES[i];
          if (styleKey.toLowerCase().includes(element.toLowerCase())) {
            isValid = true;
            break;
          }
        }
      });

      if (!isValid) {
        throw new Error(
          `[FreezableTable Error]: ${
            Object.keys({ styleObj })[0]
          } only supports styles relating to: ${SUPPORTED_STYLES.join(', ')}`
        );
      }
    };
    if (firstRowStyles && Object.keys(firstRowStyles).length > 0)
      validateCellStyles(firstRowStyles);
    if (firstColStyles && Object.keys(firstColStyles).length > 0)
      validateCellStyles(firstColStyles);
    if (bodyStyles && Object.keys(bodyStyles).length > 0)
      validateCellStyles(bodyStyles);
  }
}

// determine if a render case is special or not
export function determineCase(freezeRowNum?: number, freezeColNum?: number) {
  if (
    (freezeRowNum &&
      freezeRowNum === 0 &&
      freezeColNum &&
      freezeColNum === 0) ||
    (!freezeRowNum && !freezeColNum) ||
    (!freezeRowNum && freezeColNum && freezeColNum === 0) ||
    (!freezeColNum && freezeRowNum && freezeRowNum === 0)
  ) {
    return { type: 'special', scrolling: [true, false] };
  }

  if (
    (freezeColNum === 0 && freezeRowNum !== 0) ||
    (!freezeColNum && freezeRowNum && freezeRowNum !== 0)
  ) {
    return { type: 'special', scrolling: [true, true] };
  }

  if (
    (freezeColNum !== 0 && freezeRowNum === 0) ||
    (!freezeRowNum && freezeColNum && freezeColNum !== 0)
  ) {
    return { type: 'special', scrolling: [false, false] };
  }

  return { type: 'regular', scrolling: [] };
}
