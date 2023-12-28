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
    console.log(row, 'row.sports.detail');
    return (
        <TableRow hover selected={selected}>
            <TableCell>{row._id}</TableCell>

            <TableCell>{format(new Date(row.createdAt), 'yyyy-MM-dd h:mm:ss')}</TableCell>

            <TableCell>{row.detail.resultType}</TableCell>

            <TableCell>{row.detail?.discipline}</TableCell>

            <TableCell>{row.detail?.event}</TableCell>

            <TableCell>{row.detail?.market}</TableCell>

            <TableCell>{row.detail?.outcome}</TableCell>

            <TableCell> {fcustomCurrency(row.amount)} </TableCell>

            <TableCell>{fcustomCurrency(row.user_credit)}</TableCell>
        </TableRow>
    );
}
