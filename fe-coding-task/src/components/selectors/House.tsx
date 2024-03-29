import { NativeSelect } from '@mui/material';
import { ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { BoligType, FormValues } from '../../interfaces';
const boligTypes = Object.values(BoligType);

export const HouseSelector: React.FC =  () => {
  const { register, setValue } = useFormContext<FormValues>()
  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValue('boligType', event.target.value)
  }
  return (
    <NativeSelect
      {...register('boligType')}
      onChange={onChange}
    >
        {boligTypes.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </NativeSelect>
  )
}
