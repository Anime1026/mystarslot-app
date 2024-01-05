import { format } from 'date-fns';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
// utils
import { fcustomCurrency } from 'src/utils/format-number';

// components
import Label from 'src/components/label';

// ----------------------------------------------------------------------

type Props = {
    row: any;
    selected: boolean;
    onSelectRow: VoidFunction;
    onViewRow: VoidFunction;
    onEditRow: VoidFunction;
    onDeleteRow: VoidFunction;
};

export default function InvoiceTableRow({ row, selected, onSelectRow, onViewRow, onEditRow, onDeleteRow }: Props) {
    const { amount, createdAt, jackpot, shop_name, user_name } = row;
    return (
        <TableRow hover selected={selected}>
            <TableCell padding="checkbox">
                <Checkbox checked={selected} onClick={onSelectRow} />
            </TableCell>

            <TableCell>{user_name}</TableCell>

            <TableCell>{shop_name}</TableCell>

            <TableCell>{jackpot}</TableCell>

            <TableCell>
                <Label variant="soft" color="success">
                    {fcustomCurrency(amount)}
                </Label>
            </TableCell>

            <TableCell>{format(new Date(createdAt), 'yyyy-MM-dd h:mm:ss')}</TableCell>
        </TableRow>
    );
}
