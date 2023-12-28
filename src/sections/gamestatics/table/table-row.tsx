import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
// import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fcustomCurrency } from 'src/utils/format-number';

// routers
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

// components
import Iconify from 'src/components/iconify';

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

    const mdUp = useResponsive('up', 'md');

    const collapse = useBoolean();

    const [opendList, setOpendList] = useState<any>({});

    const router = useRouter();

    const handleOpenChild = (id: string) => {
        if (opendList[id]) {
            setOpendList((pre: any) => ({ ...pre, [id]: false }));
        } else {
            setOpendList((pre: any) => ({ ...pre, [id]: true }));
        }
    };

    const handleEditRow = useCallback(
        (id: string) => {
            router.push(paths.dashboard.gamedetail(id));
        },
        [router]
    );

    const renderSecondary = (childrenItem: any) => (
        <>
            {childrenItem.children.map((item: any, key: any) => (
                <>
                    <TableRow hover selected={selected} key={key}>
                        <TableCell padding="checkbox">
                            <Checkbox checked={selected} onClick={onSelectRow} />
                        </TableCell>

                        <TableCell sx={{ width: 352 }}>
                            <Box
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                {item._id}
                            </Box>
                        </TableCell>

                        <TableCell
                            sx={{
                                display: 'flex',
                                width: 270
                            }}
                        >
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

                        <TableCell sx={{ width: mdUp ? 120 : 140 }}>{fcustomCurrency(item.outamount)}</TableCell>

                        <TableCell sx={{ width: mdUp ? 120 : 140 }}>{fcustomCurrency(item.inamount)}</TableCell>

                        <TableCell sx={{ width: mdUp ? 120 : 140 }}>
                            {fcustomCurrency(item.outamount - item.inamount)}
                        </TableCell>
                        {item.children.length > 0 ? (
                            <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap', width: 70 }}>
                                <IconButton
                                    color={collapse.value ? 'inherit' : 'default'}
                                    onClick={() => handleOpenChild(item.id)}
                                    sx={{
                                        ...(collapse.value && {
                                            bgcolor: 'action.hover'
                                        })
                                    }}
                                >
                                    {opendList[item.id] ? (
                                        <Iconify icon="eva:arrow-ios-upward-fill" />
                                    ) : (
                                        <Iconify icon="eva:arrow-ios-downward-fill" />
                                    )}
                                </IconButton>
                            </TableCell>
                        ) : (
                            <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap', width: 70 }}>
                                <IconButton onClick={() => handleEditRow(item._id)}>
                                    <Iconify icon="bx:show-alt" />
                                </IconButton>
                            </TableCell>
                        )}
                    </TableRow>
                    {opendList[item.id] && renderSecondary(item)}
                </>
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

                <TableCell sx={{ width: 352 }}>
                    <Box
                        sx={{
                            cursor: 'pointer'
                        }}
                    >
                        {row._id}
                    </Box>
                </TableCell>

                <TableCell sx={{ display: 'flex', alignItems: 'center', width: 270 }}>
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

                <TableCell sx={{ width: mdUp ? 120 : 140 }}> {fcustomCurrency(outamount)} </TableCell>

                <TableCell sx={{ width: mdUp ? 120 : 140 }}>{fcustomCurrency(inamount)}</TableCell>

                <TableCell sx={{ width: mdUp ? 120 : 140 }}> {fcustomCurrency(outamount - inamount)} </TableCell>
                {row.children.length > 0 ? (
                    <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap', width: 70 }}>
                        <IconButton
                            color={collapse.value ? 'inherit' : 'default'}
                            onClick={() => handleOpenChild(row.id)}
                            sx={{
                                ...(collapse.value && {
                                    bgcolor: 'action.hover'
                                })
                            }}
                        >
                            {opendList[row.id] ? (
                                <Iconify icon="eva:arrow-ios-upward-fill" />
                            ) : (
                                <Iconify icon="eva:arrow-ios-downward-fill" />
                            )}
                        </IconButton>
                    </TableCell>
                ) : (
                    <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap', width: 70 }}>
                        <IconButton onClick={() => handleEditRow(row._id)}>
                            <Iconify icon="bx:show-alt" />
                        </IconButton>
                    </TableCell>
                )}
            </TableRow>
            {opendList[row.id] && renderSecondary(row)}
        </>
    );
}
