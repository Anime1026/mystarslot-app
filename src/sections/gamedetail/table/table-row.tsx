import { format } from 'date-fns';
// @mui

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// utils
import { fcustomCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type Props = {
    row: any;
    selected: boolean;
};

export default function OrderTableRow({ row, selected }: Props) {
    return (
        <TableRow hover selected={selected}>
            <TableCell>{row._id}</TableCell>

            <TableCell>{format(new Date(row.createdAt), 'yyyy-MM-dd h:mm:ss')}</TableCell>

            <TableCell>{row.detail.resultType}</TableCell>

            <TableCell>{row.game_id === null ? '' : row.game_id.name}</TableCell>

            <TableCell>{row.provider_id === null ? '' : row.provider_id.name}</TableCell>

            <TableCell> {fcustomCurrency(row.amount)} </TableCell>

            <TableCell>{fcustomCurrency(row.user_credit)}</TableCell>
        </TableRow>
    );
}
