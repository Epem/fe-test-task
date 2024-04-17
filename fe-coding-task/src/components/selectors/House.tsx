import { Select } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { BoligType, FormValues } from '../../interfaces';
const boligTypes = Object.values(BoligType);

export const HouseSelector: React.FC = () => {
  const { register } = useFormContext<FormValues>()
  return (
    <>
      <Select<string[]>
        {...register('boligType')}
        multiple
        native
      >
        {boligTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Select>
    </>
  )
}
