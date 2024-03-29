import { SubmitHandler, useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { FormValues } from '../interfaces';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../hooks';
import { setFormData } from '../state';
import { getNumberFromDate } from '../utils';

export function useForm() {
    const dispatch = useDispatch();
    const { handleSubmit, setValue } = useFormContext<FormValues>();
    const { startTid, endTid, boligType } = useTypedSelector((state) => state.global);
    useEffect(() => {
        if (startTid && endTid && boligType) {
            setValue('tIds', [getNumberFromDate(startTid), getNumberFromDate(endTid)]);
            setValue('boligType', boligType);
        }
    }, [setValue, startTid, endTid, boligType]);
    const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => dispatch(setFormData(data))

    return {
        onSubmit,
        handleSubmit,
    };
}
