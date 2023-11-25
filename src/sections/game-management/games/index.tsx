import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _userList, USER_STATUS_OPTIONS } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
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
import { IUserItem, IUserTableFilters, IUserTableFilterValue } from 'src/types/user';
//
import UserTableRow from './table-row';
import UserTableToolbar from './table-toolbar';
import UserTableFiltersResult from './table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
    { id: 'categories', label: 'Categories' },
    { id: 'provider', label: 'Providers' },
    { id: 'createAt', label: 'Create Time' },
    { id: 'status', label: 'Status' },
    { id: '' }
];

const defaultFilters: IUserTableFilters = {
    name: '',
    role: [],
    status: 'all'
};

// ----------------------------------------------------------------------

export default function Categoreis() {
    const table = useTable();

    const settings = useSettingsContext();

    const confirm = useBoolean();

    const [tableData, setTableData] = useState<any>([]);

    const [filters, setFilters] = useState(defaultFilters);

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters
    });

    const dataInPage = dataFiltered.slice(
        table.page * table.rowsPerPage,
        table.page * table.rowsPerPage + table.rowsPerPage
    );

    const denseHeight = table.dense ? 52 : 72;

    const canReset = !isEqual(defaultFilters, filters);

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    const handleFilters = useCallback(
        (name: string, value: IUserTableFilterValue) => {
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

    const handleFilterStatus = useCallback(
        (event: React.SyntheticEvent, newValue: string) => {
            handleFilters('status', newValue);
        },
        [handleFilters]
    );

    const handleResetFilters = useCallback(() => {
        setFilters(defaultFilters);
    }, []);

    return (
        <>
            <Container maxWidth={settings.themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Games"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        { name: 'Games', href: paths.operator.list },
                        { name: 'GameList' }
                    ]}
                    sx={{
                        mb: { xs: 3, md: 5 }
                    }}
                />

                <Card>
                    <Tabs
                        value={filters.status}
                        onChange={handleFilterStatus}
                        sx={{
                            px: 2.5,
                            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`
                        }}
                    >
                        {STATUS_OPTIONS.map((tab) => (
                            <Tab
                                key={tab.value}
                                iconPosition="end"
                                value={tab.value}
                                label={tab.label}
                                icon={
                                    <Label
                                        variant={
                                            ((tab.value === 'all' || tab.value === filters.status) && 'filled') ||
                                            'soft'
                                        }
                                        color={
                                            (tab.value === 'active' && 'success') ||
                                            (tab.value === 'pending' && 'warning') ||
                                            (tab.value === 'banned' && 'error') ||
                                            'default'
                                        }
                                    >
                                        {tab.value === 'all' && _userList.length}
                                        {tab.value === 'active' &&
                                            _userList.filter((user) => user.status === 'active').length}

                                        {tab.value === 'banned' &&
                                            _userList.filter((user) => user.status === 'banned').length}
                                    </Label>
                                }
                            />
                        ))}
                    </Tabs>

                    <UserTableToolbar
                        filters={filters}
                        onFilters={handleFilters}
                    //
                    />

                    {canReset && (
                        <UserTableFiltersResult
                            filters={filters}
                            onFilters={handleFilters}
                            onResetFilters={handleResetFilters}
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
                                <>
                                    <Tooltip title="Disable">
                                        <IconButton color="primary" onClick={confirm.onTrue}>
                                            <Typography>Disable</Typography>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Enable">
                                        <IconButton color="primary" onClick={confirm.onTrue}>
                                            <Typography>Enable</Typography>
                                        </IconButton>
                                    </Tooltip>
                                </>
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
                                        .map((row: any) => (
                                            <UserTableRow
                                                key={row.id}
                                                row={row}
                                                selected={table.selected.includes(row.id)}
                                                onSelectRow={() => table.onSelectRow(row.id)}
                                                onDeleteRow={() => handleDeleteRow(row.id)}
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
    filters
}: {
    inputData: IUserItem[];
    comparator: (a: any, b: any) => number;
    filters: IUserTableFilters;
}) {
    const { name, status, role } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (name) {
        inputData = inputData.filter((user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1);
    }

    if (status !== 'all') {
        inputData = inputData.filter((user) => user.status === status);
    }

    if (role.length) {
        inputData = inputData.filter((user) => role.includes(user.role));
    }

    return inputData;
}
