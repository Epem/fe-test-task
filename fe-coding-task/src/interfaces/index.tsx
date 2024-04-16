import { FieldValues } from 'react-hook-form';


export interface ApiRawData {
    version: string;
    class: string;
    label: string;
    source: string;
    updated: string;
    note: string[];
    role: {
        time: string[];
        metric: string[];
    };
    id: string[];
    size: number[];
    dimension: {
        Boligtype: {
            label: string;
            category: {
                index: Record<string, number>;
                label: Record<string, string>;
            };
            extension: {
                elimination: boolean;
                eliminationValueCode: string;
                show: string;
            };
            link: {
                describedby: {
                    extension: {
                        Boligtype: string;
                    };
                }[];
            };
        };
        ContentsCode: {
            label: string;
            category: {
                index: Record<string, number>;
                label: Record<string, string>;
                unit: Record<string, { base: string; decimals: number }>;
            };
            extension: {
                elimination: boolean;
                refperiod: Record<string, string>;
                show: string;
            };
        };
        Tid: {
            label: string;
            category: {
                index: Record<string, number>;
                label: Record<string, string>;
            };
            extension: {
                elimination: boolean;
                show: string;
            };
        };
    };
    extension: {
        px: {
            infofile: string;
            tableid: string;
            decimals: number;
            'official-statistics': boolean;
            aggregallowed: boolean;
            language: string;
            matrix: string;
            'subject-code': string;
        };
        contact: {
            name: string;
            phone: string;
            mail: string;
            raw: string;
        }[];
    };
    value: number[];
}

export interface ApiRequestData {
    boligType: string[],
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
    saved:boolean
}

export interface FormValues extends FieldValues {
    boligType: string[];
    tIds: number[];
}


export interface StateInterface {
    startTid: string;
    endTid: string;
    boligType: string[];
    contentsCode: string;
    responseFormat: string;
    dataFetching: boolean;
    localstorage: RowData[]; 
    chartLoading: boolean;
    fail: boolean;
    errorMessage: string;
  }


  export interface RootState {
    global: StateInterface
  }

  export enum BoligType {
    All = 'Boliger i alt',
    SmallHouse = 'Småhus',
    ApartmentBlocks = 'Blokkleiligheter'
  }
  