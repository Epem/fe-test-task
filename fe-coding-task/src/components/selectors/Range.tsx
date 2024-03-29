import { Grid, Slider } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '../../interfaces';
import { generateQList, getDateFromNumber, qCountFn } from '../../utils';
import { useCallback } from 'react';

import './styles.css'

export const RangeSelector: React.FC = () => {
  const { setValue, watch } = useFormContext<FormValues>();
  const tIds = watch('tIds');
  const sliderStep = 1;
  const qCount = useCallback(() => qCountFn(), []);
  const qList = useCallback(() => generateQList(qCount()), [qCount])

  const handleChange = (_event: Event, newValue: number | number[], active: number) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    const [left, right] = newValue;

    switch (active) {
      case 0:
        setValue('tIds', [Math.min(left, tIds[1]), tIds[1]]);
        break;
      case 1:
        setValue('tIds', [tIds[0], Math.max(right, tIds[0])]);
        break;
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={1}></Grid>
      <Grid item xs={10}>
        <Slider
          value={tIds}
          size='small'
          min={0}
          max={qCount()}
          step={sliderStep}
          marks={qList()}
          disableSwap
          valueLabelFormat={(value) => <div>{getDateFromNumber(value)}</div>}
          onChange={handleChange}
          valueLabelDisplay="auto"
        />
      </Grid>
      <Grid item xs={1}></Grid>
    </Grid>
  );
};
