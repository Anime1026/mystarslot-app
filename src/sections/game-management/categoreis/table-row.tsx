import { format } from 'date-fns';
import { useState } from 'react';
// @mui
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;

type Props = {
    rowselected: boolean;
    row: any;
    onSelectRow: VoidFunction;
    onDeleteRow: VoidFunction;
};

export default function UserTableRow({ row, rowselected, onSelectRow, onDeleteRow }: Props) {
    const { createdAt, name, status, _id } = row;

    const confirm = useBoolean();

    const popover = usePopover();

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
        // const res = await addCategory(addArray);
        // setTableData(res.data);
    };

    const [displayProviders, setDisplayProviders] = useState<any>([]);

    return (
        <>
            <TableRow hover selected={rowselected}>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{_id}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{name}</TableCell>
                <TableCell>
                    <ListItemText
                        primary={format(new Date(createdAt), 'dd MMM yyyy')}
                        secondary={format(new Date(createdAt), 'p')}
                        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                        secondaryTypographyProps={{
                            mt: 0.5,
                            component: 'span',
                            typography: 'caption'
                        }}
                    />
                </TableCell>
                <TableCell>
                    <Label
                        variant="soft"
                        color={(status === true && 'success') || (status === false && 'error') || 'default'}
                    >
                        {(status === true && 'Enable') || (status === false && 'Disable')}
                    </Label>
                </TableCell>

                <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                    <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                        <Iconify icon="mdi:playlist-edit" />
                    </IconButton>
                    <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top" sx={{ width: 140 }}>
                <MenuItem
                    onClick={() => {
                        confirm.onTrue();
                        popover.onClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                </MenuItem>

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
