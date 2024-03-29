import { LineChart } from '@mui/x-charts';
import { useChartData } from '../hooks';
import { useDispatch } from 'react-redux';
import { saveToLocalStorage } from '../state';
import { Button } from '@mui/material';

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
    return (
        chartData &&
        <div className="chart">
            <h2>Chart for {chartData.boligType} type</h2>
            {renderButton()}
            <LineChart
                width={1200}
                height={400}
                xAxis={[{ 
                    data: Array.from({ length: chartData.chartPoints.prices.length }, (_, index) => index),
                    dataKey: 'kvartal',
                    valueFormatter: (value) => `${chartData.chartPoints.names[value]}`
                 }]}
                yAxis={[
                    { id: 'linearAxis', scaleType: 'linear' },
                ]}
                series={[
                    {
                        yAxisKey: 'linearAxis',
                        data: chartData.chartPoints.prices, 
                        label: 'Price',
                        valueFormatter: (value) => `${value} kr`
                    },
                ]}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }} />
        </div>
    )
}
