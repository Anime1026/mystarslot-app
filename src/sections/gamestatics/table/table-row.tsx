import { Fragment, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
// import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fcustomCurrency } from 'src/utils/format-number';

// components
import Iconify from 'src/components/iconify';
import { Paper, Stack, Table, TableBody } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
    row: any;
    selected: boolean;
    onViewRow: VoidFunction;
    onSelectRow: VoidFunction;
    onDeleteRow: VoidFunction;
};

export default function OrderTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow }: Props) {
    const { username, avatar, email, inamount, outamount } = row;

    const collapse = useBoolean();

    const [toggleValue, setToggleValue] = useState<any>({});
    const ontoggle = (id: string) =>
        setToggleValue((prev: any) => ({
            ...prev,
            [id]: !prev[id]
        }));

    const renderSecondary = (childrenItem: any) => (
        <>
            {childrenItem.children.map((item: any, key: any) => (
                <Fragment key={key}>
                    {item.outamount !== undefined && (
                        <>
                            <TableRow>
                                <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
                                    <Collapse
                                        in={toggleValue[item.parent_id]}
                                        timeout="auto"
                                        unmountOnExit
                                        sx={{ bgcolor: 'background.neutral' }}
                                    >
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
                                                                {item._id}
                                                                {/* {orderNumber} */}
                                                            </Box>
                                                        </TableCell>

                                                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar alt={username} src={avatar} sx={{ mr: 2 }} />

                                                            <ListItemText
                                                                primary={item.username}
                                                                secondary={item.email}
                                                                primaryTypographyProps={{ typography: 'body2' }}
                                                                secondaryTypographyProps={{
                                                                    component: 'span',
                                                                    color: 'text.disabled'
                                                                }}
                                                            />
                                                        </TableCell>

                                                        <TableCell>{fcustomCurrency(item.inamount)}</TableCell>

                                                        <TableCell align="center">
                                                            {fcustomCurrency(item.outamount)}
                                                        </TableCell>

                                                        <TableCell>
                                                            {fcustomCurrency(Math.abs(item.outamount - item.inamount))}
                                                        </TableCell>
                                                        {item.children.length > 0 ? (
                                                            <TableCell
                                                                align="right"
                                                                sx={{ px: 1, whiteSpace: 'nowrap' }}
                                                            >
                                                                <IconButton
                                                                    color={collapse.value ? 'inherit' : 'default'}
                                                                    onClick={() => ontoggle(item.id)}
                                                                    sx={{
                                                                        ...(collapse.value && {
                                                                            bgcolor: 'action.hover'
                                                                        })
                                                                    }}
                                                                >
                                                                    <Iconify icon="eva:arrow-ios-downward-fill" />
                                                                </IconButton>
                                                            </TableCell>
                                                        ) : (
                                                            <TableCell />
                                                        )}
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </Stack>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                            {item.children.length > 0 && renderSecondary(item)}
                        </>
                    )}
                </Fragment>
            ))}
        </>
    );
    // }
    return (
        <>
            {/* {renderPrimary} */}

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
                        {row._id}
                    </Box>
                </TableCell>

                <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar alt={username} src={avatar} sx={{ mr: 2 }} />

                    <ListItemText
                        primary={username}
                        secondary={email}
                        primaryTypographyProps={{ typography: 'body2' }}
                        secondaryTypographyProps={{
                            component: 'span',
                            color: 'text.disabled'
                        }}
                    />
                </TableCell>

                <TableCell>{fcustomCurrency(inamount)}</TableCell>

                <TableCell align="center"> {fcustomCurrency(outamount)} </TableCell>

                <TableCell> {fcustomCurrency(Math.abs(inamount - outamount))} </TableCell>
                {row.children.length > 0 ? (
                    <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                        <IconButton
                            color={collapse.value ? 'inherit' : 'default'}
                            onClick={() => ontoggle(row.id)}
                            sx={{
                                ...(collapse.value && {
                                    bgcolor: 'action.hover'
                                })
                            }}
                        >
                            <Iconify icon="eva:arrow-ios-downward-fill" />
                        </IconButton>
                    </TableCell>
                ) : (
                    <TableCell />
                )}
            </TableRow>
            {row.children.length > 0 && renderSecondary(row)}
        </>
    );
}
