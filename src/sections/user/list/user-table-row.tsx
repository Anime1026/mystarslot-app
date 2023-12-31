import { useCallback, useState, useEffect } from 'react';
import { format } from 'date-fns';

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
// untils

import { fcustomCurrency } from 'src/utils/format-number';

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
    const { name, avatar, balance, ipAddress, email, status, bonusbalnace } = row;

    const deleteUser = useBoolean();

    const enableUser = useBoolean();

    const disableUser = useBoolean();

    const quickEdit = useBoolean();

    const popover = usePopover();

    const router = useRouter();

    const handleEditRow = useCallback(
        (id: string) => {
            router.push(paths.user.edit(id), row);
        },
        [router, row]
    );

    const [updatedAt, setUpdatedAt] = useState<any>(new Date());

    useEffect(() => {
        const timeValue = new Date(row.lastLogin);
        setUpdatedAt(timeValue);
    }, [row]);

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
                        sx={{
                            '& span': {
                                whiteSpace: 'nowrap'
                            }
                        }}
                    />
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{fcustomCurrency(balance)}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{fcustomCurrency(bonusbalnace)}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{ipAddress}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Label
                        variant="soft"
                        color={
                            (status === 'active' && 'success') ||
                            (status === 'pending' && 'error') ||
                            (status === 'disable' && 'error') ||
                            'default'
                        }
                    >
                        {status === 'active' ? 'Online' : 'offline'}

                        {/* {status} */}
                    </Label>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {/* <Tooltip title="Logout" placement="top" arrow> */}
                    {/* <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={() => handleEditRow(name)}> */}
                    <Label variant="soft" color="error" sx={{ cursor: 'pointer' }}>
                        <Iconify icon="line-md:home-twotone-alt" />
                    </Label>
                    {/* </IconButton> */}
                    {/* </Tooltip> */}
                </TableCell>

                <TableCell sx={{ whiteSpace: 'nowrap' }}>{format(updatedAt, 'yyyy-MM-dd h:mm:ss')}</TableCell>
                <TableCell>
                    <Label
                        variant="soft"
                        color={
                            (status === 'active' && 'info') ||
                            (status === 'pending' && 'warning') ||
                            (status === 'disable' && 'default') ||
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
