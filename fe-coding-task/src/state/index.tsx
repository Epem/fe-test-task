import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BoligType, FormValues, RowData, StateInterface } from "../interfaces";
import { getDateFromNumber, qCountFn } from "../utils";



const appParams = Object.fromEntries(
  new URLSearchParams(window.location.search)
)


const appStorageVersion = '2.0.0';
const localStorageVersion = localStorage.getItem('storage-version');

if (localStorageVersion !== appStorageVersion) {
  console.log('Found ancient version of storage, migrating....')
  const migrationData = JSON.parse(localStorage.getItem('storage-item') || '[]')
    .map((item: RowData) => {
      const { startTid, endTid, boligType, chartPoints, saved } = item;
      return {
        startTid,
        endTid,
        boligType: typeof boligType === 'string' ? [boligType] : boligType,
        chartPoints,
        saved
      };
    });

  localStorage.setItem('storage-item', JSON.stringify(migrationData));
  localStorage.setItem('storage-version', appStorageVersion);
  console.log('Migration done! To version', appStorageVersion)
}

const initialState: StateInterface = {
  startTid: getDateFromNumber(0),
  endTid: getDateFromNumber(qCountFn()),
  boligType: [BoligType.All],
  contentsCode: 'KvPris',
  responseFormat: 'json-stat2',
  dataFetching: false,
  chartLoading: true,
  localstorage: JSON.parse(localStorage.getItem('storage-item') || '[]'),
  fail: false,
  errorMessage: ''
};

if ('startTid' in appParams && 'endTid' in appParams && 'boligType' in appParams) {
  initialState.startTid = appParams.startTid
  initialState.endTid = appParams.endTid
  initialState.boligType = appParams.boligType.split(',')
}

console.log(initialState)

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setTid: (state, action: PayloadAction<{ startTid: number; endTid: number }>) => {
      const { startTid, endTid } = action.payload;
      state.startTid = getDateFromNumber(startTid);
      state.endTid = getDateFromNumber(endTid);
    },
    setBoligtype: (state, action: PayloadAction<{ boligType: string[]; }>) => {
      const { boligType } = action.payload;
      state.boligType = boligType;
    },
    setChartLoading: (state) => {
      state.chartLoading = !state.chartLoading;
    },
    setDataFetching: (state) => {
      state.dataFetching = !state.dataFetching;
    },
    setFormData: (state, action: PayloadAction<FormValues>) => {
      if (state.dataFetching) return;
      const { tIds, boligType } = action.payload;
      state.startTid = getDateFromNumber(tIds[0]);
      state.endTid = getDateFromNumber(tIds[1]);
      state.boligType = boligType;
    },
    setFromCache: (state, action: PayloadAction<RowData>) => {
      if (state.dataFetching) return;
      const { startTid, endTid, boligType } = action.payload;
      state.startTid = startTid;
      state.endTid = endTid;
      state.boligType = boligType;
    },
    fetchData: (state) => {
      if (state.dataFetching) return;
      state.chartLoading = false;
      state.dataFetching = true;
    },
    saveToLocalStorage: (state, action: PayloadAction<RowData>) => {
      action.payload.saved = true;
      state.localstorage.push(action.payload)
      localStorage.setItem('storage-item', JSON.stringify(state.localstorage));
    },
    handleError: (state) => {
      state.fail = true;
      state.errorMessage = 'Fetching error';
    },
    resetError: (state) => {
      state.fail = false;
      state.errorMessage = '';
    },
    dataFetched: (state) => {
      state.chartLoading = true;
      state.dataFetching = false;
    }
  }
})

export const {
  setTid,
  setBoligtype,
  setChartLoading,
  setDataFetching,
  setFormData,
  setFromCache,
  saveToLocalStorage,
  handleError,
  resetError,
  fetchData,
  dataFetched
} = globalSlice.actions;

export default globalSlice.reducer;