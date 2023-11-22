import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
    useTable,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom
} from 'src/components/table';
// types
import { IUserTableFilters, IUserTableFilterValue } from 'src/types/user';
// api
import { allProviders, addCategory } from 'src/api';
//
import UserTableRow from './table-row';
import UserTableFiltersResult from './table-filters-result';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'id', label: 'Id' },
    { id: 'name', label: 'Name' },
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

    const dataInPage = tableData.slice(
        table.page * table.rowsPerPage,
        table.page * table.rowsPerPage + table.rowsPerPage
    );

    const denseHeight = table.dense ? 52 : 72;

    const canReset = !isEqual(defaultFilters, filters);

    const notFound = (!tableData.length && canReset) || !tableData.length;

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
            totalRowsFiltered: tableData.length
        });
    }, [dataInPage.length, table, tableData]);

    const handleResetFilters = useCallback(() => {
        setFilters(defaultFilters);
    }, []);

    // caregorie add

    const [open, setOpen] = useState(false);
    const [addArray, setAddArray] = useState<any>({
        category: '',
        providers: []
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAutocompleteChange = (event: any, values: any) => {
        setAddArray({ ...addArray, providers: values });
    };

    const addCategories = async () => {
        const res = await addCategory(addArray);
        setTableData(res.data);
    };

    const [displayProviders, setDisplayProviders] = useState<any>([]);

    useEffect(() => {
        const fetchData = async () => {
            const allProvider = await allProviders();
            setDisplayProviders(allProvider.data.provider);
            setTableData(allProvider.data.category);
        };
        fetchData();
    }, []);

    return (
        <>
            <Container maxWidth={settings.themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Categories"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        { name: 'Games', href: paths.games.category },
                        { name: 'Categories' }
                    ]}
                    action={
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            onClick={handleClickOpen}
                        >
                            New Cateory
                        </Button>
                    }
                    sx={{
                        mb: { xs: 3, md: 5 }
                    }}
                />

                <Card>
                    {canReset && (
                        <UserTableFiltersResult
                            filters={filters}
                            onFilters={handleFilters}
                            onResetFilters={handleResetFilters}
                            results={tableData.length}
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
                                    tableData.map((row: any) => row._id)
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
                                    <Tooltip title="Delete">
                                        <IconButton color="primary" onClick={confirm.onTrue}>
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
                                />

                                <TableBody>
                                    {tableData
                                        .slice(
                                            table.page * table.rowsPerPage,
                                            table.page * table.rowsPerPage + table.rowsPerPage
                                        )
                                        .map((row: any) => (
                                            <UserTableRow
                                                key={row._id}
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
                        count={tableData.length}
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

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Category</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Category Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(e: any) => {
                            setAddArray({ ...addArray, category: e.target.value });
                        }}
                    />

                    <DialogContentText sx={{ pt: 2, pb: 2 }}>
                        Please select the providers that fall into this category.
                    </DialogContentText>

                    <Autocomplete
                        multiple
                        id="checkboxes-tags-demo"
                        options={displayProviders}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option.name}
                        renderOption={(props, option, { selected }) => (
                            <li {...props}>
                                <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                />
                                {option.name}
                            </li>
                        )}
                        style={{ width: 500 }}
                        onChange={handleAutocompleteChange}
                        renderInput={(params) => <TextField {...params} label="Checkboxes" placeholder="Favorites" />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={addCategories}>Add</Button>
                </DialogActions>
            </Dialog>

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
