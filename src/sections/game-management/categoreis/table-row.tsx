import { format } from 'date-fns';
// @mui
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

type Props = {
    selected: boolean;
    row: any;
    onSelectRow: VoidFunction;
    onDeleteRow: VoidFunction;
};

export default function UserTableRow({ row, selected, onSelectRow, onDeleteRow }: Props) {
    const { createdAt, name, status, _id } = row;

    const confirm = useBoolean();

    const popover = usePopover();

    return (
        <>
            <TableRow hover selected={selected}>
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
