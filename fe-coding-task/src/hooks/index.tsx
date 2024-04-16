import { useState, useEffect } from 'react';
import { RootState, RowData } from '../interfaces';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { findChart, getBoligTypeValue, formatChartData, getTidArray } from '../utils';
import { useGetChartDataMutation } from '../state/api';
import { dataFetched, fetchData, handleError } from '../state';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useChartData = () => {
  const dispatch = useDispatch();
  const [chartData, setChartData] = useState<RowData | null>(null);
  const { localstorage, startTid, endTid, boligType, contentsCode, responseFormat } = useTypedSelector((state) => state.global);
  const [getRawChartData] = useGetChartDataMutation()

  useEffect(() => {
    if (startTid && endTid && boligType) {
      const localChartData = findChart(startTid, endTid, boligType[0], localstorage)
      if (localChartData) {
        const { chartPoints, saved } = localChartData
        setChartData({ chartPoints, boligType: boligType[0], startTid, endTid, saved });
        return;
      }
      const getChartData = async (startTid: string, endTid: string, boligType: string[]): Promise<void> => {

        const tidArray = getTidArray(startTid, endTid);
        const boligTypeValue = [getBoligTypeValue(boligType[0]), getBoligTypeValue(boligType[1])];
        const tempBody = {
          boligType: boligTypeValue,
          contentsCode,
          tid: tidArray,
          responseFormat
        }
        try {
          dispatch(fetchData())
          const chartDataResponse = await getRawChartData(tempBody);
          if ('error' in chartDataResponse) throw Error(`Error fetching data`)
          const chartPoints = formatChartData(chartDataResponse);
          setChartData({ chartPoints, boligType: boligType[0], startTid, endTid, saved: false });
          dispatch(dataFetched());
        } catch (error) {
          dispatch(handleError());
          dispatch(dataFetched());
        }
      }
      getChartData(startTid, endTid, boligType);
    }
  }, [localstorage, dispatch, getRawChartData, startTid, endTid, boligType, contentsCode, responseFormat]);

  return [chartData]
}