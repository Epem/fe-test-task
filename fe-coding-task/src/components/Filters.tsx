import { Button, CircularProgress, Grid, Toolbar, Typography } from '@mui/material';
import { HouseSelector } from './selectors/House';
import { RangeSelector } from './selectors/Range';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '../interfaces';
import { getDateFromNumber } from '../utils';
import { useTypedSelector } from '../hooks';
import { useForm } from '../controllers/Form';

export function Filters() {

  const isDataLoading = useTypedSelector((state) => state.global.dataFetching);
  const isChartLoaded = useTypedSelector((state) => state.global.chartLoading)
  const {
    onSubmit,
    handleSubmit,
  } = useForm()

  const { watch } = useFormContext<FormValues>()
  const tIds = watch('tIds');

  return (
    <>
      <Toolbar>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Typography>
              Selected quarters range
            </Typography>
            <RangeSelector />
            <Typography>
              Selected quarters: {getDateFromNumber(tIds[0])} - {getDateFromNumber(tIds[1])}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              Select house type
            </Typography>
            <HouseSelector />
          </Grid>
        </Grid>
      </Toolbar>
      <Button onClick={handleSubmit(onSubmit)}>Generate chart</Button>
      {isDataLoading && !isChartLoaded && <CircularProgress />}
    </>
  )
}
