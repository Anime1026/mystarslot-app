import { useState, useCallback, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
// routes
import { paths } from 'src/routes/paths';
// utils
import { useAuthContext } from 'src/auth/hooks';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { getSportsDetail } from 'src/api';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
    useTable,
    getComparator,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom
} from 'src/components/table';
// types
import { ITableType, IOrderTableFilters, IOrderTableFilterValue } from 'src/types/order';
import { useParams } from 'react-router-dom';
//
import TotalPrice from './table/total-price';
import GameStaticsTableRow from './table/table-row';
import GameStaticsTableSearch from './table/order-table-filters-result';
import GameStaticsTableToolbar from './table/table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'orderNumber', label: 'Id' },
    { id: 'createdAt', label: 'Date/Time' },
    { id: 'type', label: 'Type' },
    { id: 'name', label: 'Discipline' },
    { id: 'provider', label: 'Event' },
    { id: 'market', label: 'Market' },
    { id: 'outcome', label: 'Outcome' },
    { id: 'amount', label: 'Amount' },
    { id: 'credit', label: 'Credit' }
];

const defaultFilters: IOrderTableFilters = {
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
    service: [],
    categories: []
};

// ----------------------------------------------------------------------

export default function OrderListView() {
    const theme = useTheme();

    const { user } = useAuthContext();

    const table = useTable({ defaultOrderBy: 'orderNumber' });

    const settings = useSettingsContext();

    const confirm = useBoolean();

    const params_: any = useParams();

    const [tableData, setTableData] = useState<ITableType[]>([]);
    const [totalInAmount, setTotalInAmount] = useState(0);
    const [totalOutAmount, setTotalOutAmount] = useState(0);
    const [filters, setFilters] = useState(defaultFilters);

    const dateError =
        filters.startDate && filters.endDate ? filters.startDate.getTime() > filters.endDate.getTime() : false;

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters,
        dateError
    });

    const getGameTransactions = useCallback(async () => {
        // params_
        const result = await getSportsDetail({ filter: filters, user_id: params_ });
        if (result.status) {
            const data =
                result.gameData.gameDetail.length > 0 && result.gameData.gameDetail[0]._id === user?._id
                    ? result.gameData.gameDetail[0].children
                    : result.gameData.gameDetail;
            // data = data.filter((item: any) => item.inamount + item.outamount > 0);
            setTableData(data);
            setTotalInAmount(result.totalInAmount);
            setTotalOutAmount(result.totalOutAmount);
        }
    }, [filters, user, params_]);

    useEffect(() => {
        getGameTransactions();
    }, [getGameTransactions]);

    const dataInPage = dataFiltered.slice(
        table.page * table.rowsPerPage,
        table.page * table.rowsPerPage + table.rowsPerPage
    );

    const denseHeight = !table.dense ? 72 : 52;

    const canReset = !!filters.name || filters.status !== 'all' || (!!filters.startDate && !!filters.endDate);

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    const handleFilters = useCallback(
        (name: string, value: IOrderTableFilterValue) => {
            table.onResetPage();
            setFilters((prevState) => ({
                ...prevState,
                [name]: value
            }));
            getGameTransactions();
        },
        [table, getGameTransactions]
    );

    const handleDeleteRows = useCallback(() => {
        const deleteRows = tableData.filter((row: any) => !table.selected.includes(row.id));
        setTableData(deleteRows);

        table.onUpdatePageDeleteRows({
            totalRows: tableData.length,
            totalRowsInPage: dataInPage.length,
            totalRowsFiltered: dataFiltered.length
        });
    }, [dataFiltered.length, dataInPage.length, table, tableData]);

    const handleResetFilters = useCallback(() => {
        setFilters(defaultFilters);
    }, []);

    return (
        <>
            <Container maxWidth={settings.themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Sports Detail"
                    links={[
                        {
                            name: 'Dashboard',
                            href: paths.dashboard.root
                        },
                        {
                            name: 'Sports Statics',
                            href: paths.dashboard.sportsstatics
                        },
                        { name: 'List' }
                    ]}
                    sx={{
                        mb: { xs: 3, md: 5 }
                    }}
                />

                <Card
                    sx={{
                        mb: { xs: 3, md: 5 }
                    }}
                >
                    <Scrollbar>
                        <Stack
                            direction="row"
                            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
                            sx={{ py: 2 }}
                        >
                            <TotalPrice
                                title="Total BET"
                                percent={totalOutAmount}
                                price={totalOutAmount}
                                icon="solar:file-check-bold-duotone"
                                color={theme.palette.success.main}
                            />
                            <TotalPrice
                                title="Total WIN"
                                percent={totalInAmount}
                                price={totalInAmount}
                                icon="solar:bill-list-bold-duotone"
                                color={theme.palette.info.main}
                            />

                            <TotalPrice
                                title="Total GGR"
                                percent={100}
                                price={totalOutAmount - totalInAmount}
                                icon="solar:sort-by-time-bold-duotone"
                                color={theme.palette.warning.main}
                            />
                        </Stack>
                    </Scrollbar>
                </Card>

                <Card>
                    <GameStaticsTableToolbar
                        filters={filters}
                        onFilters={handleFilters}
                        //
                        canReset={canReset}
                        onResetFilters={handleResetFilters}
                    />

                    {canReset && (
                        <GameStaticsTableSearch
                            filters={filters}
                            onFilters={handleFilters}
                            //
                            onResetFilters={handleResetFilters}
                            //
                            results={dataFiltered.length}
                            sx={{ p: 2.5, pt: 0 }}
                        />
                    )}

                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <TableSelectedAction
                            dense={table.dense}
                            numSelected={table.selected.length}
                            rowCount={tableData.length}
                            onSelectAllRows={(checked) =>
                                table.onSelectAllRows(
                                    checked,
                                    tableData.map((row: any) => row.id)
                                )
                            }
                            action={
                                <Tooltip title="Delete">
                                    <IconButton color="primary" onClick={confirm.onTrue}>
                                        <Iconify icon="solar:trash-bin-trash-bold" />
                                    </IconButton>
                                </Tooltip>
                            }
                        />

                        <Scrollbar>
                            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                                <TableHeadCustom
                                    order={table.order}
                                    orderBy={table.orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={tableData.length}
                                    numSelected={table.selected.length}
                                    onSort={table.onSort}
                                />

                                <TableBody>
                                    {dataFiltered
                                        .slice(
                                            table.page * table.rowsPerPage,
                                            table.page * table.rowsPerPage + table.rowsPerPage
                                        )
                                        .map((row: any, key) => (
                                            <GameStaticsTableRow
                                                key={key}
                                                row={row}
                                                selected={table.selected.includes(row._id)}
                                            />
                                        ))}

                                    <TableEmptyRows
                                        height={denseHeight}
                                        emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                                    />

                                    <TableNoData notFound={notFound} />
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>

                    <TablePaginationCustom
                        count={dataFiltered.length}
                        page={table.page}
                        rowsPerPage={table.rowsPerPage}
                        onPageChange={table.onChangePage}
                        onRowsPerPageChange={table.onChangeRowsPerPage}
                        //
                        dense={table.dense}
                        onChangeDense={table.onChangeDense}
                    />
                </Card>
            </Container>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content={
                    <>
                        Are you sure want to delete <strong> {table.selected.length} </strong> items?
                    </>
                }
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleDeleteRows();
                            confirm.onFalse();
                        }}
                    >
                        Delete
                    </Button>
                }
            />
        </>
    );
}

// ----------------------------------------------------------------------

function applyFilter({
    inputData,
    comparator,
    filters,
    dateError
}: {
    inputData: ITableType[];
    comparator: (a: any, b: any) => number;
    filters: IOrderTableFilters;
    dateError: boolean;
}) {
    // const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    // stabilizedThis.sort((a, b) => {
    //     const order = comparator(a[0], b[0]);
    //     if (order !== 0) return order;
    //     return a[1] - b[1];
    // });

    // inputData = stabilizedThis.map((el) => el[0]);

    // if (name) {
    //     inputData = inputData.filter(
    //         (order) =>
    //             order.id.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
    //             order.username.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
    //             order.email.toLowerCase().indexOf(name.toLowerCase()) !== -1
    //     );
    // }
    // if (status !== 'all') {
    //     inputData = inputData.filter((order) => order.status === status);
    // }

    // if (!dateError) {
    //     if (startDate && endDate) {
    //         inputData = inputData.filter(
    //             (order) =>
    //                 fTimestamp(order.createdAt) >= fTimestamp(startDate) &&
    //                 fTimestamp(order.createdAt) <= fTimestamp(endDate)
    //         );
    //     }
    // }

    return inputData;
}
