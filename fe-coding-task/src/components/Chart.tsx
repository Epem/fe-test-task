import { LineChart, LineSeriesType } from '@mui/x-charts';
import { useChartData } from '../hooks';
import { useDispatch } from 'react-redux';
import { saveToLocalStorage } from '../state';
import { Button } from '@mui/material';
import { useCallback } from 'react';
import { splitIntoChunks } from '../utils';


export function Chart() {
    const dispatch = useDispatch()
    const [chartData] = useChartData()

    const renderButton = () => {
        if (!chartData?.saved) {
            return (
                <Button onClick={handleImportClick}>Save Chart Data?</Button>
            );
        }
        return null;
    };

    const handleImportClick = () => {
        chartData && dispatch(saveToLocalStorage(chartData))
    };

    const chartdataCallback = useCallback(() => {
        if (!chartData) return null
        const pointsArray = splitIntoChunks(chartData.chartPoints.prices, chartData.boligType.length)
        const data = chartData.boligType.reduce((prev, next, id) => {
            const config = {
                yAxisKey: 'linearAxis',
                data: pointsArray[id],
                label: `Average price per square meter for ${next}`,
                valueFormatter: <V extends number | null>(value: V) => `${value} kr`
            }
            prev.push(config)
            return prev;
        }, [] as Omit<LineSeriesType, "type">[])

        return data
    }, [chartData])

    const cachedChartData = chartdataCallback()

    return (
        cachedChartData && chartData &&
        <>
            {renderButton()}
            <LineChart
                width={1200}
                height={400}
                xAxis={[{
                    data: Array.from({ length: chartData.chartPoints.prices.length / chartData.boligType.length }, (_, index) => index),
                    dataKey: 'kvartal',
                    valueFormatter: (value) => `${chartData.chartPoints.names[value] || ''}`
                }]}
                yAxis={[
                    { id: 'linearAxis', scaleType: 'linear', valueFormatter: (_value) => `${_value}` },
                ]}
                series={cachedChartData}
                margin={{ top: 20, right: 20, bottom: 20, left: 60 }} />
        </>
    )
}
