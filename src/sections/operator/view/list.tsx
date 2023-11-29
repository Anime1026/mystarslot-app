import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
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
import { RouterLink } from 'src/routes/components';
// _mock
import { _roles, USER_STATUS_OPTIONS } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
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
// apis
import { getList, remove, update } from 'src/api';
//
import UserTableRow from '../list/user-table-row';
import UserTableToolbar from '../list/user-table-toolbar';
import UserTableFiltersResult from '../list/user-table-filters-result';
// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
    { id: 'name', label: 'Name' },
    { id: 'balance', label: 'BALANCE TND', width: 180 },
    { id: 'fido', label: 'FIDO TND', width: 180 },
    { id: 'ip_address', label: 'Ip Address', width: 220 },
    { id: 'lastLogin', label: 'Last Login', width: 180 },
    { id: 'status', label: 'Status', width: 100 },
    { id: '', width: 88 }
];

const defaultFilters: IUserTableFilters = {
    name: '',
    role: [],
    status: 'all'
};

type tableType = {
    id: string;
    zipCode: string;
    userName: string;
    state: string;
    city: string;
    role: string;
    email: string;
    address: string;
    name: string;
    isVerified: boolean;
    company: string;
    country: string;
    timezone: string;
    avatar: string;
    phoneNumber: string;
    status: string;
    password: string;
    balance: number;
    fidoAmount: number;
    lastLogin: string;
    ipAddress: string;
    bonus: string;
    casinortp: string;
    virtualrtp: string;
    minigamesrtp: string;
};

// ----------------------------------------------------------------------

export default function UserListView() {
    const table = useTable();

    const settings = useSettingsContext();

    const deleteUser = useBoolean();

    const enable = useBoolean();

    const disable = useBoolean();

    const [tableData, setTableData] = useState<tableType[]>([]);

    const [filters, setFilters] = useState(defaultFilters);

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters
    });

    const operator = async () => {
        const data = await getList({ type: 'admin' });
        const result = data.data.data;
        const tableList: tableType[] = [];
        for (let i = 0; i < result.length; i += 1) {
            tableList.push({
                id: result[i].id,
                userName: result[i].username,
                password: '',
                zipCode: result[i].zipCode ? result[i].zipCode : '',
                state: result[i].state,
                city: result[i].city,
                role: result[i].roleId,
                email: result[i].email,
                address: result[i].address,
                balance: result[i].balance ? result[i].balance : 0,
                fidoAmount: result[i].fido_amount ? result[i].fido_amount : 0,
                name: result[i].username,
                isVerified: result[i].isVerified ? result[i].isVerified : false,
                company: result[i].company ? result[i].company : '',
                country: result[i].country ? result[i].country : '',
                timezone: result[i].timezone ? result[i].timezone : 'UTC',
                avatar: result[i].avatar ? result[i].avatar : '',
                phoneNumber: result[i].phoneNumber ? result[i].phoneNumber : '',
                status: result[i].status ? result[i].status : '',
                lastLogin: result[i].updatedAt,
                ipAddress: result[i].ipAddress ? result[i].ipAddress : '',
                bonus: result[i].bonus ? result[i].bonus : '',
                casinortp: result[i].casinortp ? result[i].casinortp : '',
                virtualrtp: result[i].virtualrtp ? result[i].virtualrtp : '',
                minigamesrtp: result[i].minigamesrtp ? result[i].minigamesrtp : ''
            });
        }
        setTableData(tableList);
    };

    useEffect(() => {
        operator();
    }, []);

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
        async (id: string) => {
            const result = await remove({ id });
            if (result.status) {
                const deleteRow = tableData.filter((row) => row.id !== id);
                setTableData(deleteRow);

                table.onUpdatePageDeleteRow(dataInPage.length);
            }
        },
        [dataInPage.length, table, tableData]
    );

    const handleEnableRow = useCallback(async (id: string, status: string) => {
        const result = await update({ id, status });
        if (result.status) operator();
    }, []);

    const handleDisableRow = useCallback(async (id: string, status: string) => {
        const result = await update({ id, status });
        if (result.status) operator();
    }, []);

    const handleDeleteRows = useCallback(() => {
        const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
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
                    heading="Operators"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        { name: 'Operators', href: paths.operator.list },
                        { name: 'List' }
                    ]}
                    action={
                        <Button
                            component={RouterLink}
                            href={paths.operator.create}
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                        >
                            New Operator
                        </Button>
                    }
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
                                            (tab.value === 'disable' && 'error') ||
                                            'default'
                                        }
                                    >
                                        {tab.value === 'all' && tableData.length}
                                        {tab.value === 'active' &&
                                            tableData.filter((user) => user.status === 'active').length}

                                        {tab.value === 'disable' &&
                                            tableData.filter((user) => user.status === 'disable').length}
                                    </Label>
                                }
                            />
                        ))}
                    </Tabs>

                    <UserTableToolbar
                        filters={filters}
                        onFilters={handleFilters}
                        //
                        roleOptions={_roles}
                    />

                    {canReset && (
                        <UserTableFiltersResult
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
                                    tableData.map((row) => row.id)
                                )
                            }
                            action={
                                <>
                                    <Tooltip title="Disable">
                                        <IconButton color="primary" onClick={disable.onTrue}>
                                            <Typography>Disable</Typography>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Enable">
                                        <IconButton color="primary" onClick={enable.onTrue}>
                                            <Typography>Enable</Typography>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton color="primary" onClick={deleteUser.onTrue}>
                                            <Iconify icon="solar:trash-bin-trash-bold" />
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
                                            tableData.map((row) => row.id)
                                        )
                                    }
                                />

                                <TableBody>
                                    {dataFiltered
                                        .slice(
                                            table.page * table.rowsPerPage,
                                            table.page * table.rowsPerPage + table.rowsPerPage
                                        )
                                        .map((row) => (
                                            <UserTableRow
                                                key={row.id}
                                                row={row}
                                                selected={table.selected.includes(row.id)}
                                                onSelectRow={() => table.onSelectRow(row.id)}
                                                onDeleteRow={() => handleDeleteRow(row.id)}
                                                onEnableRow={() => handleEnableRow(row.id, 'active')}
                                                onDisableRow={() => handleDisableRow(row.id, 'disable')}
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
                open={enable.value}
                onClose={enable.onFalse}
                title="Enable"
                content={
                    <>
                        Are you sure want to enable <strong> {table.selected.length} </strong> items?
                    </>
                }
                action={
                    <Button
                        variant="contained"
                        color="info"
                        onClick={() => {
                            handleDeleteRows();
                            enable.onFalse();
                        }}
                    >
                        Enable
                    </Button>
                }
            />
            <ConfirmDialog
                open={disable.value}
                onClose={disable.onFalse}
                title="Disable"
                content={
                    <>
                        Are you sure want to disable <strong> {table.selected.length} </strong> items?
                    </>
                }
                action={
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => {
                            handleDeleteRows();
                            disable.onFalse();
                        }}
                    >
                        Disable
                    </Button>
                }
            />
            <ConfirmDialog
                open={deleteUser.value}
                onClose={deleteUser.onFalse}
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
                            deleteUser.onFalse();
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
