import { useCallback } from 'react';
// @mui
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { IUserItem } from 'src/types/user';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';

// routers
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

//
// import UserQuickEditForm from './user-quick-edit-form';

// ----------------------------------------------------------------------

type Props = {
    selected: boolean;
    onEditRow: VoidFunction;
    row: IUserItem;
    onSelectRow: VoidFunction;
    onDeleteRow: VoidFunction;
    onEnableRow: VoidFunction;
    onDisableRow: VoidFunction;
};

export default function UserTableRow({
    row,
    selected,
    onEditRow,
    onSelectRow,
    onDeleteRow,
    onEnableRow,
    onDisableRow
}: Props) {
    const { name, avatar, status, email, balance, ipAddress, lastLogin, role } = row;

    const deleteUser = useBoolean();

    const enableUser = useBoolean();

    const disableUser = useBoolean();

    const quickEdit = useBoolean();

    const popover = usePopover();

    const router = useRouter();

    const handleEditRow = useCallback(
        (id: string) => {
            router.push(paths.shop.edit(id), row);
        },
        [router, row]
    );

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell>
                <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar alt={name} src={avatar} sx={{ mr: 2 }} />

                    <ListItemText
                        primary={name}
                        secondary={email}
                        primaryTypographyProps={{ typography: 'body2' }}
                        secondaryTypographyProps={{
                            component: 'span',
                            color: 'text.disabled'
                        }}
                    />
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{balance}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{ipAddress}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{role}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{lastLogin}</TableCell>
                <TableCell>
                    <Label
                        variant="soft"
                        color={
                            (status === 'active' && 'success') ||
                            (status === 'pending' && 'warning') ||
                            (status === 'disable' && 'error') ||
                            'default'
                        }
                    >
                        {status}
                    </Label>
                </TableCell>

                <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                    <Tooltip title="Show" placement="top" arrow>
                        <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={() => handleEditRow(name)}>
                            <Iconify icon="bx:show-alt" />
                        </IconButton>
                    </Tooltip>

                    <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            {/* <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} /> */}

            <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top" sx={{ width: 140 }}>
                <MenuItem
                    onClick={() => {
                        deleteUser.onTrue();
                        popover.onClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        enableUser.onTrue();
                        popover.onClose();
                    }}
                >
                    <Iconify icon="entypo:check" />
                    Enable
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        disableUser.onTrue();
                        popover.onClose();
                    }}
                >
                    <Iconify icon="ic:sharp-disabled-visible" />
                    Disable
                </MenuItem>
            </CustomPopover>

            <ConfirmDialog
                open={enableUser.value}
                onClose={enableUser.onFalse}
                title="Enable"
                content="Are you sure want to enable this user?"
                action={
                    <Button
                        variant="contained"
                        color="info"
                        onClick={() => {
                            onEnableRow();
                            enableUser.onFalse();
                        }}
                    >
                        Enable
                    </Button>
                }
            />
            <ConfirmDialog
                open={disableUser.value}
                onClose={disableUser.onFalse}
                title="Disable"
                content="Are you sure want to disable this user?"
                action={
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => {
                            onDisableRow();
                            disableUser.onFalse();
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
