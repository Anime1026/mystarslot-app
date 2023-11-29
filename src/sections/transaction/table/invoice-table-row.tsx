import { format } from 'date-fns';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fCurrency } from 'src/utils/format-number';
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
    const { id, from, to, type, inAmount, outAmount, date, note } = row;

    return (
        <TableRow hover selected={selected}>
            <TableCell sx={{ alignItems: 'center' }}>{id}</TableCell>

            <TableCell>{from}</TableCell>

            <TableCell>{to}</TableCell>

            <TableCell>{type}</TableCell>

            <TableCell>
                <Label variant="soft" color="success">
                    {inAmount.toLocaleString('it-IT')}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label variant="soft" color="error">
                    {outAmount.toLocaleString('it-IT')}
                </Label>
            </TableCell>

            <TableCell>{format(new Date(date), 'yyyy-MM-dd h:mm:ss')}</TableCell>
            <TableCell>{note}</TableCell>
        </TableRow>
    );
}
