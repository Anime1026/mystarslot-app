import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';
import TableContainer from '@mui/material/TableContainer';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import TextField from '@mui/material/TextField';
// routes
import { paths } from 'src/routes/paths';

// component
import { useSettingsContext } from 'src/components/settings';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

function createData(
    level: string,
    balance: number,
    startingbalance: number,
    startingpayoutbalance: number,
    endpayoutbalance: number,
    paysum: number
) {
    return { level, balance, startingbalance, startingpayoutbalance, endpayoutbalance, paysum };
}

const rows = [
    createData('Bronze', 159, 6.0, 24, 4.0, 6),
    createData('Silver', 237, 9.0, 37, 4.3, 5),
    createData('Gold', 262, 16.0, 24, 6.0, 7),
    createData('Platinum', 305, 3.7, 67, 4.3, 8)
];

export default function BasicTable() {
    const settings = useSettingsContext();

    const { enqueueSnackbar } = useSnackbar();

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
                                <TableCell>STARTING VALUE</TableCell>
                                <TableCell>STARTING PAYOUT VALUE</TableCell>
                                <TableCell>END PAYOUT VALUE</TableCell>
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
                                    <TableCell>{row.balance}</TableCell>
                                    <TableCell>
                                        <TextField id="outlined-number" type="number" size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            // value={row.startingbalance}
                                            name={`username${index}`}
                                            size="small"
                                        />
                                        {row.startingpayoutbalance}
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            // value={row.startingbalance}
                                            name={`username${index}`}
                                            size="small"
                                        />
                                        {row.endpayoutbalance}
                                    </TableCell>
                                    <TableCell>{row.paysum}</TableCell>
                                    <TableCell>actions</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained">
                    Save Changes
                </LoadingButton>
            </Stack>
        </Container>
    );
}
