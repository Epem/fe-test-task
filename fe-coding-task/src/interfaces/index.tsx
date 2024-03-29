import { FieldValues } from 'react-hook-form';


export interface ApiRawData {
    value: number[]
}

export interface ApiRequestData {
    boligType: string,
    contentsCode: string,
    tid: string[],
    responseFormat: string
}


export interface ChartRequestBody {
    query: {
        code: string;
        selection: {
            filter: string;
            values: string[];
        };
    }[];
    response: {
        format: string;
    };
}


export interface RowData {
    startTid: string,
    endTid: string,
    chartPoints: {
        names: string[],
        prices: number[]
    },
    boligType: string,
    saved:false
}

export interface FormValues extends FieldValues {
    boligType: string;
    tIds: number[];
}


export interface StateInterface {
    startTid: string;
    endTid: string;
    boligType: string;
    contentsCode: string;
    responseFormat: string;
    dataFetching: boolean;
    localstorage: RowData[]; 
    chartLoading: boolean;
  }


  export interface RootState {
    global: StateInterface
  }

  export enum BoligType {
    All = 'Boliger i alt',
    SmallHouse = 'Småhus',
    ApartmentBlocks = 'Blokkleiligheter'
  }
  