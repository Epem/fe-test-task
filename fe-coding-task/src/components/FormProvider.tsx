import { useForm, FormProvider } from 'react-hook-form';
import { ReactNode, useEffect } from 'react';
import { FormValues } from '../interfaces';
import { useTypedSelector } from '../hooks';
import { useSearchParams } from 'react-router-dom';
import { getNumberFromDate } from '../utils';

interface Props {
  children: ReactNode;
}

export function FiltersForm({ children }: Props) {
  const { startTid, endTid, boligType } = useTypedSelector((state) => state.global);
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!startTid && !endTid && !boligType[0] && !boligType[1]) return
    const queryParams = new URLSearchParams({
      startTid,
      endTid,
      boligType: boligType.join(','),
    });
    setSearchParams(queryParams);
  }, [setSearchParams, startTid, endTid, boligType]);
  const methods = useForm<FormValues>({
    defaultValues: { boligType: boligType, tIds: [getNumberFromDate(startTid), getNumberFromDate(endTid)] }
  });

  return (
    <FormProvider {...methods}>
      {children}
    </FormProvider>
  )
}
