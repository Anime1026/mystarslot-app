import { format } from 'date-fns';
import { useState } from 'react';
// @mui
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// api
import { getCategories, changeCategories } from 'src/api';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;

type Props = {
    rowselected: boolean;
    row: any;
    onUpdateData: VoidFunction;
    onSelectRow: VoidFunction;
    onDeleteRow: VoidFunction;
};

export default function UserTableRow({ row, rowselected, onSelectRow, onDeleteRow, onUpdateData }: Props) {
    const { enqueueSnackbar } = useSnackbar();

    const confirm = useBoolean();

    const popover = usePopover();

    const quickEdit = useBoolean();

    const [open, setOpen] = useState(false);

    const [displayProviders, setDisplayProviders] = useState<any>([]);

    const [addArray, setAddArray] = useState<any>({
        category: '',
        providers: []
    });

    const [value, setValue] = useState<any>([]);

    const [providerId, setProviderId] = useState<any>();

    const [providerName, setProviderName] = useState('');

    const handleEditRow = async (data: any) => {
        setOpen(true);
        setProviderName(data.name);
        setProviderId(data._id);

        const res = await getCategories();
        const result = res.data.filter((item: any) => item._id === data.categoryId._id);

        setValue(result);
        setDisplayProviders(res.data);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAutocompleteChange = (event: any, values: any) => {
        if (values.length > 1) {
            enqueueSnackbar('You can select only one category', { variant: 'info' });
        } else {
            setValue(values);
        }
    };

    const addCategories = async () => {
        if (value.length < 1) {
            enqueueSnackbar('You must select only one category', { variant: 'error' });
        } else {
            const res = await changeCategories({ value, provider: providerId });
            enqueueSnackbar(res.data, { variant: 'success' });
            await onUpdateData();
            setOpen(false);
        }
    };

    return (
        <>
            <TableRow hover selected={rowselected}>
                <TableCell padding="checkbox">
                    <Checkbox checked={rowselected} onClick={onSelectRow} />
                </TableCell>

                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.categoryId.name}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.name}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.service}</TableCell>
                <TableCell>{format(new Date(row.createdAt), 'yyyy-MM-dd h:mm:ss')}</TableCell>
                <TableCell>
                    <Label
                        variant="soft"
                        color={(row.status === true && 'success') || (row.status === false && 'error') || 'default'}
                    >
                        {(row.status === true && 'Enabled') || (row.status === false && 'Disabled')}
                    </Label>
                </TableCell>

                <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                    <Tooltip title="Show" placement="top" arrow>
                        <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={() => handleEditRow(row)}>
                            <Iconify icon="bx:show-alt" />
                        </IconButton>
                    </Tooltip>
                    <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top" sx={{ width: 140 }}>
                {/* <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem> */}

                <MenuItem
                    onClick={() => {
                        confirm.onTrue();
                        popover.onClose();
                    }}
                >
                    <Iconify icon="entypo:check" />
                    Enable
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        confirm.onTrue();
                        popover.onClose();
                    }}
                >
                    <Iconify icon="ic:sharp-disabled-visible" />
                    Disable
                </MenuItem>
            </CustomPopover>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Provider</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Provider"
                        type="text"
                        fullWidth
                        variant="standard"
                        disabled
                        value={providerName}
                    />

                    <DialogContentText sx={{ pt: 2, pb: 2 }}>
                        Please select the categorys that fall into this provider.
                    </DialogContentText>

                    <Autocomplete
                        multiple
                        id="checkboxes-tags-demo"
                        options={displayProviders}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option.name}
                        value={value}
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
                        renderInput={(params) => (
                            <TextField {...params} label="Categories" placeholder="Select Categories" />
                        )}
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
                content="Are you sure want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={onDeleteRow}>
                        Delete
                    </Button>
                }
            />
        </>
    );
}
