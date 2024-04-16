import { NativeSelect } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { BoligType, FormValues } from '../../interfaces';
const boligTypes = Object.values(BoligType);

export const HouseSelector: React.FC = () => {
  const {  setValue, getValues } = useFormContext<FormValues>()
  const [values, setValues] = useState<string[]>(getValues('boligType'))
  const onChange = (selectorId: number)=> (event: ChangeEvent<HTMLSelectElement>) => {
    const array = [...values]
    array[selectorId] = event.target.value
    setValues(array)
    setValue('boligType', array)
  }
  return (
    <>
      <NativeSelect
        onChange={onChange(0)}
        value={values[0]}
      >
        {boligTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </NativeSelect>
      <NativeSelect
        onChange={onChange(1)}
        value={values[1]}
      >
        {boligTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </NativeSelect>
    </>
  )
}
