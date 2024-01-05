import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import TableContainer from '@mui/material/TableContainer';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// routes
import { paths } from 'src/routes/paths';

// component
import { useSettingsContext } from 'src/components/settings';
import { useSnackbar } from 'src/components/snackbar';

// utils
import { fcustomCurrency } from 'src/utils/format-number';

// apis
import { jackpotsetting, getJackpot, jackpotregenerate } from 'src/api';

function createData(
    level: string,
    balance: number,
    startingbalance: number,
    startingpayoutbalance: number,
    endpayoutbalance: number,
    paysum: number,
    action: string
) {
    return { level, balance, startingbalance, startingpayoutbalance, endpayoutbalance, paysum, action };
}

export default function BasicTable() {
    const settings = useSettingsContext();

    const { enqueueSnackbar } = useSnackbar();

    const [settingValue, setSettingValue] = useState<any>({
        silver: {
            startvalue: 0,
            startpayoutvalue: 0,
            endvalue: 0,
            paysum: 0
        },
        gold: {
            startvalue: 0,
            startpayoutvalue: 0,
            endvalue: 0,
            paysum: 0
        },
        platinum: {
            startvalue: 0,
            startpayoutvalue: 0,
            endvalue: 0,
            paysum: 0
        }
    });

    const [fee, setFee] = useState(0);

    const handleSetting = (key: string, subKey: string, value: string) => {
        setSettingValue((pre: any) => ({ ...pre, [key]: { ...pre[key], [subKey]: value } }));
    };

    const rows = [
        createData(
            'Silver',
            237,
            settingValue.silver.startvalue,
            settingValue.silver.startpayoutvalue,
            settingValue.silver.endvalue,
            settingValue.silver.paysum,
            'silver'
        ),
        createData(
            'Gold',
            262,
            settingValue.gold.startvalue,
            settingValue.gold.startpayoutvalue,
            settingValue.gold.endvalue,
            settingValue.gold.paysum,
            'gold'
        ),
        createData(
            'Platinum',
            305,
            settingValue.platinum.startvalue,
            settingValue.platinum.startpayoutvalue,
            settingValue.platinum.endvalue,
            settingValue.platinum.paysum,
            'platinum'
        )
    ];

    const regenerate = async (key: string) => {
        const result = await jackpotregenerate({ key, data: settingValue[key] });

        if (result.data) {
            setSettingValue({
                gold: result.data.gold,
                silver: result.data.silver,
                platinum: result.data.platinum
            });
            setFee(result.data.fee);
        }

        enqueueSnackbar('Update Success', { variant: 'success' });
    };

    const jackpotSave = async () => {
        await jackpotsetting({ fee, data: settingValue });
        enqueueSnackbar('Update Success', { variant: 'success' });
    };

    const init = useCallback(async () => {
        const result = await getJackpot();
        if (result.data) {
            setSettingValue({
                gold: result.data.gold,
                silver: result.data.silver,
                platinum: result.data.platinum
            });
            setFee(result.data.fee);
        }
    }, []);

    useEffect(() => {
        init();
    }, [init]);

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Jackpot"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Jackpot', href: paths.jackpot.history },
                    { name: 'Settings' }
                ]}
                sx={{
                    mb: { xs: 3, md: 5 }
                }}
            />

            <Card>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>LEVEL</TableCell>
                                <TableCell>BALANCE</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>STARTING VALUE</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>STARTING PAYOUT VALUE</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>END PAYOUT VALUE</TableCell>
                                <TableCell>PAYSUM</TableCell>
                                <TableCell>&nbsp;&nbsp;</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={row.level} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {row.level}
                                    </TableCell>
                                    <TableCell>{fcustomCurrency(row.startingbalance)}</TableCell>
                                    <TableCell>
                                        <TextField
                                            id="outlined-number"
                                            value={row.startingbalance}
                                            type="number"
                                            size="small"
                                            onChange={(e) => handleSetting(row.action, 'startvalue', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={row.startingpayoutbalance}
                                            size="small"
                                            onChange={(e) =>
                                                handleSetting(row.action, 'startpayoutvalue', e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={row.endpayoutbalance}
                                            size="small"
                                            onChange={(e) => handleSetting(row.action, 'endvalue', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>{fcustomCurrency(row.paysum)}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="info"
                                            onClick={() => {
                                                regenerate(row.action);
                                            }}
                                        >
                                            Regenerate
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
            <Stack flexDirection="row" spacing={3} alignItems="center" justifyContent="flex-end" sx={{ mt: 3 }}>
                <Typography>Global Fee</Typography>
                <TextField
                    id="outlined-number"
                    size="small"
                    type="number"
                    value={fee}
                    onChange={(e) => setFee(Number(e.target.value))}
                />
                <LoadingButton type="submit" variant="contained" onClick={jackpotSave}>
                    save
                </LoadingButton>
            </Stack>
        </Container>
    );
}
