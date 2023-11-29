import { format } from 'date-fns';
// @mui
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import TableContainer from '@mui/material/TableContainer';
// utils
import { fCurrency } from 'src/utils/format-number';
// type
import { TransactionType } from 'src/types/invoice';
// components
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';

// ----------------------------------------------------------------------

interface Props extends CardProps {
    title?: string;
    subheader?: string;
    tableData: TransactionType[];
    tableLabels: any;
}

export default function EcommerceBestSalesman({ title, subheader, tableData, tableLabels, ...other }: Props) {
    return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

            <TableContainer sx={{ overflow: 'unset' }}>
                <Scrollbar>
                    <Table sx={{ minWidth: 640 }}>
                        <TableHeadCustom headLabel={tableLabels} />

                        <TableBody>
                            {tableData.map((row) => (
                                <EcommerceBestSalesmanRow key={row.id} row={row} />
                            ))}
                        </TableBody>
                    </Table>
                </Scrollbar>
            </TableContainer>
        </Card>
    );
}

// ----------------------------------------------------------------------

type EcommerceBestSalesmanRowProps = {
    row: TransactionType;
};

function EcommerceBestSalesmanRow({ row }: EcommerceBestSalesmanRowProps) {
    return (
        <TableRow>
            <TableCell sx={{ display: 'flex', alignItems: 'center' }}>{row.id}</TableCell>

            <TableCell>{row.from}</TableCell>

            <TableCell align="center">{row.to}</TableCell>

            <TableCell align="right">
                <Label variant="soft" color="success">
                    {fCurrency(row.inAmount)}
                </Label>
            </TableCell>

            <TableCell align="right">
                <Label variant="soft" color="error">
                    {fCurrency(row.outAmount)}
                </Label>
            </TableCell>
            <TableCell align="right">{format(new Date(row.date), 'dd MMM yyyy')}</TableCell>
        </TableRow>
    );
}
