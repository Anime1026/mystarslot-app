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
    const { id, from, to, type, inAmount, outAmount, date } = row;

    return (
        <TableRow hover selected={selected}>
            <TableCell sx={{ alignItems: 'center' }}>{id}</TableCell>

            <TableCell>{from}</TableCell>

            <TableCell>{to}</TableCell>

            <TableCell>{type}</TableCell>

            <TableCell>{fCurrency(inAmount)}</TableCell>

            <TableCell align="center">{fCurrency(outAmount)}</TableCell>

            <TableCell>
                <ListItemText
                    primary={format(new Date(date), 'dd MMM yyyy')}
                    secondary={format(new Date(date), 'p')}
                    primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                    secondaryTypographyProps={{
                        mt: 0.5,
                        component: 'span',
                        typography: 'caption'
                    }}
                />
            </TableCell>
        </TableRow>
    );
}
