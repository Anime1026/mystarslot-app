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
import { useRouter } from 'src/routes/hooks';
// utils
import { fTimestamp } from 'src/utils/format-time';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { getGameStatics } from 'src/api';
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
//
import TotalPrice from './table/total-price';
import GameStaticsTableRow from './table/table-row';
import GameStaticsTableSearch from './table/order-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'orderNumber', label: 'Id', width: 116 },
    { id: 'name', label: 'Username' },
    { id: 'createdAt', label: 'In', width: 140 },
    { id: 'totalQuantity', label: 'Out', width: 120, align: 'center' },
    { id: 'totalAmount', label: 'Sum', width: 140 },
    { id: '', width: 88 }
];

const defaultFilters: IOrderTableFilters = {
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
    service: []
};

// ----------------------------------------------------------------------

export default function OrderListView() {
    const theme = useTheme();

    const table = useTable({ defaultOrderBy: 'orderNumber' });

    const settings = useSettingsContext();

    const router = useRouter();

    const confirm = useBoolean();

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

    const getGameTransactions = async () => {
        const result = await getGameStatics();
        if (result.status) {
            console.log(result.users);
            let data = result.users ? result.users[0].children : [];
            data = data.filter((item: any) => item.inamount + item.outamount > 0);
            setTableData(data);
            setTotalInAmount(result.totalInAmount);
            setTotalOutAmount(result.totalOutAmount);
        }
    };

    useEffect(() => {
        getGameTransactions();
    }, []);

    const dataInPage = dataFiltered.slice(
        table.page * table.rowsPerPage,
        table.page * table.rowsPerPage + table.rowsPerPage
    );

    const denseHeight = table.dense ? 52 : 72;

    const canReset = !!filters.name || filters.status !== 'all' || (!!filters.startDate && !!filters.endDate);

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    const handleFilters = useCallback(
        (name: string, value: IOrderTableFilterValue) => {
            table.onResetPage();
            setFilters((prevState) => ({
                ...prevState,
                [name]: value
            }));
        },
        [table]
    );

    const handleDeleteRow = useCallback(
        (id: string) => {
            const deleteRow = tableData.filter((row: any) => row.id !== id);
            setTableData(deleteRow);

            table.onUpdatePageDeleteRow(dataInPage.length);
        },
        [dataInPage.length, table, tableData]
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

    const handleViewRow = useCallback(
        (id: string) => {
            router.push(paths.operator.edit(id));
        },
        [router]
    );

    return (
        <>
            <Container maxWidth={settings.themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Game Statics"
                    links={[
                        {
                            name: 'Dashboard',
                            href: paths.dashboard.root
                        },
                        {
                            name: 'Game Statics',
                            href: paths.dashboard.gamestatics
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
                                title="Total In"
                                percent={totalInAmount}
                                price={totalInAmount}
                                icon="solar:bill-list-bold-duotone"
                                color={theme.palette.info.main}
                            />

                            <TotalPrice
                                title="Total Out"
                                percent={totalOutAmount}
                                price={totalOutAmount}
                                icon="solar:file-check-bold-duotone"
                                color={theme.palette.success.main}
                            />

                            <TotalPrice
                                title="SUM"
                                percent={100}
                                price={Math.abs(totalInAmount - totalOutAmount)}
                                icon="solar:sort-by-time-bold-duotone"
                                color={theme.palette.warning.main}
                            />
                        </Stack>
                    </Scrollbar>
                </Card>

                <Card>
                    {/* <GameStaticsTableToolbar
                        filters={filters}
                        onFilters={handleFilters}
                        //
                        canReset={canReset}
                        onResetFilters={handleResetFilters}
                    /> */}

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
                                    onSelectAllRows={(checked) =>
                                        table.onSelectAllRows(
                                            checked,
                                            tableData.map((row: any) => row.id)
                                        )
                                    }
                                />

                                <TableBody>
                                    {dataFiltered
                                        .slice(
                                            table.page * table.rowsPerPage,
                                            table.page * table.rowsPerPage + table.rowsPerPage
                                        )
                                        .map((row, key) => (
                                            <GameStaticsTableRow
                                                key={row.id}
                                                row={row}
                                                selected={table.selected.includes(row.id)}
                                                onSelectRow={() => table.onSelectRow(row.id)}
                                                onDeleteRow={() => handleDeleteRow(row.id)}
                                                onViewRow={() => handleViewRow(row.id)}
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
    const { name, startDate, endDate } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (name) {
        inputData = inputData.filter(
            (order) =>
                order.id.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
                order.username.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
                order.email.toLowerCase().indexOf(name.toLowerCase()) !== -1
        );
    }
    // if (status !== 'all') {
    //     inputData = inputData.filter((order) => order.status === status);
    // }

    if (!dateError) {
        if (startDate && endDate) {
            inputData = inputData.filter(
                (order) =>
                    fTimestamp(order.createdAt) >= fTimestamp(startDate) &&
                    fTimestamp(order.createdAt) <= fTimestamp(endDate)
            );
        }
    }

    return inputData;
}
