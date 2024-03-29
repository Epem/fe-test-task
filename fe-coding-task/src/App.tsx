import './App.css'
import { Chart } from './components/Chart';
import { DataTable } from './components/DataTable';
import { Filters } from './components/Filters';
import { FiltersForm } from './components/FormProvider';
import { useGetChartDataMutation } from './state/api';
import Paper from '@mui/material/Paper';

function App() {
  useGetChartDataMutation()
  return (
    <Paper sx={{ minWidth: 1200, margin: 'auto'}}>
      <FiltersForm>
        <Filters />
        <Chart />
        <DataTable />
      </FiltersForm>
    </Paper>

  )
}

export default App
