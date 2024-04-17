import { ApiRawData, BoligType, ChartRequestBody, RowData } from "../interfaces";

export const buildChartRequestBody = (boligType: string[], contentsCode: string, tid: string[], responseFormat: string): ChartRequestBody => {
  const requestBody: ChartRequestBody = {
    query: [
      {
        code: 'Boligtype',
        selection: {
          filter: 'item',
          values: boligType
        }
      },
      {
        code: 'ContentsCode',
        selection: {
          filter: 'item',
          values: [contentsCode]
        }
      },
      {
        code: 'Tid',
        selection: {
          filter: 'item',
          values: tid
        }
      }
    ],
    response: {
      format: responseFormat
    }
  };

  return requestBody;
}



export const getTidArray = (startTid: string, endTid: string): string[] => {
  const tIds: string[] = [];
  const [startYear, startNumber] = getYear(startTid);
  const [endYear, endNumber] = getYear(endTid);

  for (let year = startYear; year <= endYear; year++) {
    const start = year === startYear ? startNumber : 1;
    const end = year === endYear ? endNumber : 4;
    for (let qnumber = start; qnumber <= end; qnumber++) {
      tIds.push(`${year}K${qnumber}`);
    }
  }
  return tIds;
}

const getYear = (qnumber: string): [number, number] => {
  const [yearStr, quarterStr] = qnumber.split("K");
  const year = parseInt(yearStr);
  const quarterNumber = parseInt(quarterStr);
  return [year, quarterNumber];
}


export const formatChartData = (chartDataResponse:{data: ApiRawData}): { names: string[]; prices: number[] } => {
  return {
    names: Object.keys(chartDataResponse.data.dimension.Tid.category.label),
    prices: chartDataResponse.data.value
  }
}


export const getStorage = () => (JSON.parse(localStorage.getItem('statistics') || '[]'))


export const getBoligTypeValue = (boligType: string): string => {
  switch (boligType) {
    case BoligType.All:
      return '00';
    case BoligType.SmallHouse:
      return '02';
    case BoligType.ApartmentBlocks:
      return '03';
    default:
      return '00';
  }
};

export const qCountFn = (): number => {
  const today = new Date();
  const year = today.getFullYear();
  const q = Math.ceil((today.getMonth() + 1) / 3)
  return (year - 2009) * 4 + q - 3;
}

export const getDateFromNumber = (quarter: number): string => {
  const year = Math.floor(quarter / 4) + 2009;
  const q = quarter % 4 + 1;
  return `${year}K${q}`;
}

export const getNumberFromDate = (dateString: string): number => {
  if (!dateString) return 0;
  const [yearStr, qStr] = dateString.split('K');

  if (!yearStr || !qStr) {
    return 0;
  }

  const year = parseInt(yearStr, 10);
  const quarter = parseInt(qStr, 10);

  if (isNaN(year) || isNaN(quarter)) {
    return 0;
  }

  const calculatedQuarter = (year - 2009) * 4 + quarter - 1;

  return calculatedQuarter;
};

export const generateQList = (maxQ: number) => {
  const qList = [];
  const step = Math.round(maxQ / 6);
  let currentQ = 0;
  while (maxQ - currentQ > Math.round(step/2)) {
    qList.push({ value: currentQ, label: getDateFromNumber(currentQ) });
    currentQ += step;
  }
  qList.push({ value: maxQ, label: getDateFromNumber(maxQ) });
  return qList;
}

export const findChart = (startTid: string, endTid: string, boligType: string, localstorage: RowData[]) => localstorage.find((row: RowData) =>
  row.startTid === startTid &&
  row.endTid === endTid && JSON.stringify(row.boligType) === JSON.stringify(boligType)
)


export const splitIntoChunks = (array: number[], chunksCount: number) => {
  const chunkSize = Math.ceil(array.length / chunksCount);
  return Array.from({ length: chunksCount }, (_, index) =>
      array.slice(index * chunkSize, index * chunkSize + chunkSize)
  );
}