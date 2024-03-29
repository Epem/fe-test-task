import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { RowData } from '../interfaces'
import { useTypedSelector } from '../hooks';
import { useDispatch } from 'react-redux';
import { setFromCache } from '../state';

export const DataTable = () => {
  const dispatch = useDispatch()
  const savedData = useTypedSelector((state) => state.global.localstorage);

  const handleClick = (data:RowData) => {
    dispatch(setFromCache(data))
  }

  return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Quarters</TableCell>
              <TableCell>Bolig Type</TableCell>
              <TableCell>Control</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {savedData.map((row: RowData, index: number) => (
              <TableRow key={index}>
                <TableCell>{row.startTid} - {row.endTid}</TableCell>
                <TableCell>{row.boligType}</TableCell>
                <TableCell>
                  <Button onClick={() => handleClick(row)}>
                    Show local data
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  );
}
