// @mui
import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
// import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fCurrency } from 'src/utils/format-number';
// types
import { IOrderItem } from 'src/types/order';
// components
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Paper, Stack, Table, TableBody } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
    row: IOrderItem;
    selected: boolean;
    onViewRow: VoidFunction;
    onSelectRow: VoidFunction;
    onDeleteRow: VoidFunction;
};

export default function OrderTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow }: Props) {
    const { orderNumber, customer, totalQuantity, subTotal } = row;

    const confirm = useBoolean();

    const collapse = useBoolean();

    const popover = usePopover();

    const renderPrimary = (
        <TableRow hover selected={selected}>
            <TableCell padding="checkbox">
                <Checkbox checked={selected} onClick={onSelectRow} />
            </TableCell>

            <TableCell>
                <Box
                    onClick={onViewRow}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            textDecoration: 'underline'
                        }
                    }}
                >
                    {orderNumber}
                </Box>
            </TableCell>

            <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar alt={customer.name} src={customer.avatar} sx={{ mr: 2 }} />

                <ListItemText
                    primary={customer.name}
                    secondary={customer.email}
                    primaryTypographyProps={{ typography: 'body2' }}
                    secondaryTypographyProps={{
                        component: 'span',
                        color: 'text.disabled'
                    }}
                />
            </TableCell>

            <TableCell>{totalQuantity}</TableCell>

            <TableCell align="center"> {totalQuantity} </TableCell>

            <TableCell> {fCurrency(subTotal)} </TableCell>

            <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                <IconButton
                    color={collapse.value ? 'inherit' : 'default'}
                    onClick={collapse.onToggle}
                    sx={{
                        ...(collapse.value && {
                            bgcolor: 'action.hover'
                        })
                    }}
                >
                    <Iconify icon="eva:arrow-ios-downward-fill" />
                </IconButton>

                <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                    <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
            </TableCell>
        </TableRow>
    );

    const renderSecondary = (
        <TableRow>
            <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
                <Collapse in={collapse.value} timeout="auto" unmountOnExit sx={{ bgcolor: 'background.neutral' }}>
                    <Stack component={Paper} sx={{ m: 1.5 }}>
                        <Table>
                            <TableBody>
                                <TableRow hover selected={selected}>
                                    <TableCell padding="checkbox">
                                        <Checkbox checked={selected} onClick={onSelectRow} />
                                    </TableCell>

                                    <TableCell>
                                        <Box
                                            onClick={onViewRow}
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    textDecoration: 'underline'
                                                }
                                            }}
                                        >
                                            {orderNumber}
                                        </Box>
                                    </TableCell>

                                    <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar alt={customer.name} src={customer.avatar} sx={{ mr: 2 }} />

                                        <ListItemText
                                            primary={customer.name}
                                            secondary={customer.email}
                                            primaryTypographyProps={{ typography: 'body2' }}
                                            secondaryTypographyProps={{
                                                component: 'span',
                                                color: 'text.disabled'
                                            }}
                                        />
                                    </TableCell>

                                    <TableCell>{totalQuantity}</TableCell>

                                    <TableCell align="center"> {totalQuantity} </TableCell>

                                    <TableCell> {fCurrency(subTotal)} </TableCell>

                                    <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                                        <IconButton
                                            color={collapse.value ? 'inherit' : 'default'}
                                            onClick={collapse.onToggle}
                                            sx={{
                                                ...(collapse.value && {
                                                    bgcolor: 'action.hover'
                                                })
                                            }}
                                        >
                                            <Iconify icon="eva:arrow-ios-downward-fill" />
                                        </IconButton>

                                        <IconButton
                                            color={popover.open ? 'inherit' : 'default'}
                                            onClick={popover.onOpen}
                                        >
                                            <Iconify icon="eva:more-vertical-fill" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Stack>
                </Collapse>
            </TableCell>
        </TableRow>
    );

    return (
        <>
            {renderPrimary}

            {renderSecondary}

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
                        onViewRow();
                        popover.onClose();
                    }}
                >
                    <Iconify icon="solar:eye-bold" />
                    View
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
