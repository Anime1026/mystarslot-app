import { format } from 'date-fns';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
// utils
import { fcustomCurrency } from 'src/utils/format-number';

// types
import { TransactionType } from 'src/types/invoice';
// components
import Label from 'src/components/label';

// ----------------------------------------------------------------------

type Props = {
    row: TransactionType;
    selected: boolean;
    onSelectRow: VoidFunction;
    onViewRow: VoidFunction;
    onEditRow: VoidFunction;
    onDeleteRow: VoidFunction;
};

export default function InvoiceTableRow({ row, selected, onSelectRow, onViewRow, onEditRow, onDeleteRow }: Props) {
    const { id, from, to, type, inAmount, outAmount, date, note, bonus } = row;
    return (
        <TableRow hover selected={selected}>
            <TableCell padding="checkbox">
                <Checkbox checked={selected} onClick={onSelectRow} />
            </TableCell>

            <TableCell sx={{ alignItems: 'center' }}>{id}</TableCell>

            <TableCell>{from}</TableCell>

            <TableCell>{to}</TableCell>

            <TableCell>{type}</TableCell>

            <TableCell>
                <Label variant="soft" color="success">
                    {fcustomCurrency(inAmount)}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label variant="soft" color="error">
                    {fcustomCurrency(outAmount)}
                </Label>
            </TableCell>
            <TableCell align="center">
                <Label variant="soft" color="info">
                    {fcustomCurrency(bonus)}
                </Label>
            </TableCell>

            <TableCell>{format(new Date(date), 'yyyy-MM-dd h:mm:ss')}</TableCell>
            <TableCell>{note}</TableCell>
        </TableRow>
    );
}
