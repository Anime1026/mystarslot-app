import * as Yup from 'yup';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { useTheme } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';

// hooks
import { useAuthContext } from 'src/auth/hooks';
import { useRouter } from 'src/routes/hooks';

// apis
import { update, getFamily, getInOutAmount, changeCredit, changeFido, getUserTotalValue } from 'src/api';

// utils
import { fData } from 'src/utils/format-number';
import { paths } from 'src/routes/paths';
// components
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { IUserItem } from 'src/types/user';
import FormProvider, { RHFTextField, RHFUploadAvatar, RHFSelect } from 'src/components/hook-form';

import { useLocation } from 'react-router-dom';

import IncrementerButton from './account-profile/addcredit';
import BestCharts from './account-profile/best-charts';
import TotalCredit from './account-profile/total-credit';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { user, getMe } = useAuthContext();
    const location = useLocation();
    const params: IUserItem = location.state;

    const theme = useTheme();

    // add credit
    const [availableBalance, setAvailable] = useState(0);
    const [availableFido, setAvaliableFido] = useState(0);
    const [family, setFamily] = useState<string[]>([]);
    const [inAmount, setInAmount] = useState(0);
    const [outAmount, setOutAmount] = useState(0);

    useEffect(() => {
        if (user) {
            setAvailable(user.balance);
            setAvaliableFido(user.fido_amount);
        }
    }, [user]);

    const getAmounts = useCallback(async () => {
        try {
            const result = await getInOutAmount({ userName: params.userName });
            if (result.status) {
                setInAmount(result.inAmount);
                setOutAmount(result.outAmount);
            }
        } catch (error) {
            // enqueueSnackbar(error.message, { variant: 'error' });
        }
    }, [params]);

    useEffect(() => {
        getAmounts();
    }, [getAmounts]);

    const [userTotal, setUserTotal] = useState(0);
    const getUserFamily = useCallback(async () => {
        const data = await getUserTotalValue({ userid: params.userName, type: 'user' });
        setUserTotal(data.totalvalue);

        const result = await getFamily(params.userName);
        if (result.status) {
            setFamily(result.data);
        }
    }, [params.userName]);
    useEffect(() => {
        getUserFamily();
    }, [getUserFamily]);

    useEffect(() => {
        setTotalBalance(params.balance || 0);
    }, [params.balance]);

    const UpdateUserSchema = Yup.object().shape({
        displayName: Yup.string().required('Name is required'),
        email: Yup.string().required('Email is required').email('Email must be a valid email address'),
        photoURL: Yup.mixed<any>().nullable().required('Avatar is required'),
        currency: Yup.string().required('Currency is required'),
        timezone: Yup.string().required('timezone is required'),
        ip_address: Yup.string().required('City is required'),
        last_login: Yup.string().required('Zip code is required')
        // not required
    });

    const updateDate = new Date(params?.lastLogin);

    const defaultValues = {
        displayName: params?.name || '',
        email: params?.email || '',
        photoURL: params?.avatar || null,
        currency: 'TND',
        timezone: 'UTC',
        ip_address: params?.ipAddress || '78.453.276.12',
        last_login: format(updateDate, 'yyyy-MM-dd h:mm:ss') || '16/09/2023 11:00pm'
    };

    const methods = useForm({
        resolver: yupResolver(UpdateUserSchema),
        defaultValues
    });

    const {
        setValue,
        handleSubmit,
        formState: { isSubmitting }
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            const formData = new FormData();
            formData.append('image', data.photoURL);
            formData.append('id', params.id);
            formData.append('username', data.displayName);
            formData.append('email', data.email);
            formData.append('timezone', data.timezone);
            formData.append('currency', data.currency);
            const result = await update(formData);
            if (result.status) {
                enqueueSnackbar('Update success!');
                await getMe();
                router.push(paths.operator.list);
            }
        } catch (error) {
            console.error(error);
        }
    });

    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];

            Object.assign(file, {
                preview: URL.createObjectURL(file)
            });

            if (file) {
                setValue('photoURL', file, { shouldValidate: true });
            }
        },
        [setValue]
    );

    const [totalBalance, setTotalBalance] = useState(0);
    const [creditAmount, setCreditAmount] = useState(0);
    const depositCredit = async () => {
        if (note === 0 || note === '') {
            setNote('');
        } else {
            const result = await changeCredit({
                balance: creditAmount,
                type: 'deposit',
                username: params.name,
                note
            });
            await getMe();
            setTotalBalance((preTotalbalance) => Number(preTotalbalance) + Number(creditAmount));
            setCreditAmount(0);
            enqueueSnackbar(result.message);
        }
    };

    const withdrawCredit = async () => {
        if (note === 0 || note === '') {
            setNote('');
        } else {
            const result = await changeCredit({
                balance: creditAmount,
                type: 'withdraw',
                username: params.name,
                note
            });

            await getMe();
            setTotalBalance((preTotalbalance) => Number(preTotalbalance) - Number(creditAmount));
            setCreditAmount(0);
            enqueueSnackbar(result.message);
        }
    };

    // add fido

    const [fidoAmount, setFidoAmount] = useState(0);

    const depositFido = async () => {
        if (note === 0 || note === '') {
            setNote('');
        } else {
            const result = await changeFido({ balance: fidoAmount, type: 'deposit', username: params.name, note });
            enqueueSnackbar(result.message);
            setFidoAmount(0);
            router.push(paths.operator.list);
        }
    };

    const withdrawFido = async () => {
        if (note === 0 || note === '') {
            setNote('');
        } else {
            const result = await changeFido({ balance: fidoAmount, type: 'withdraw', username: params.name, note });
            enqueueSnackbar(result.message);
            setFidoAmount(0);
            router.push(paths.operator.list);
        }
    };

    // add note

    const [note, setNote] = useState<0 | string>(0);

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Card
                sx={{
                    mb: { xs: 1, md: 3 }
                }}
            >
                <Scrollbar>
                    <Stack
                        direction="row"
                        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
                        sx={{ py: 2 }}
                    >
                        <TotalCredit
                            title="IN-OUT"
                            percent={100}
                            price={inAmount + outAmount}
                            icon="solar:bill-list-bold-duotone"
                            color={theme.palette.info.main}
                        />

                        <TotalCredit
                            title="CREDITI RICEVUTI"
                            percent={(inAmount / (inAmount + outAmount)) * 100}
                            price={inAmount}
                            icon="solar:file-check-bold-duotone"
                            color={theme.palette.success.main}
                        />

                        <TotalCredit
                            title="CREDIT INVIATI"
                            percent={(outAmount / (inAmount + outAmount)) * 100}
                            price={outAmount}
                            icon="solar:sort-by-time-bold-duotone"
                            color={theme.palette.warning.main}
                        />

                        <TotalCredit
                            title="USER CREDIT"
                            percent={70}
                            price={userTotal}
                            icon="solar:file-corrupted-bold-duotone"
                            color={theme.palette.error.main}
                        />
                    </Stack>
                </Scrollbar>
            </Card>

            <Card sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    <Grid xs={12} md={6} lg={4}>
                        <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
                            <RHFUploadAvatar
                                name="photoURL"
                                maxSize={3145728}
                                onDrop={handleDrop}
                                helperText={
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            mt: 3,
                                            mx: 'auto',
                                            display: 'block',
                                            textAlign: 'center',
                                            color: 'text.disabled'
                                        }}
                                    >
                                        Allowed *.jpeg, *.jpg, *.png, *.gif
                                        <br /> max size of {fData(3145728)}
                                    </Typography>
                                }
                            />

                            <Button variant="soft" color="error" sx={{ mt: 3 }}>
                                Delete User
                            </Button>
                        </Card>
                    </Grid>

                    <Grid xs={12} md={6} lg={4}>
                        <Card sx={{ p: 3 }}>
                            <Box rowGap={3} columnGap={2} display="grid">
                                <Stack direction="row" alignItems="center">
                                    <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                                        Add Credits
                                    </Typography>

                                    <Stack spacing={1}>
                                        <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
                                            Credit Available:{' '}
                                            {user?.roleId === 'super_admin' ? '∞' : availableBalance + params.balance}
                                        </Typography>
                                        <IncrementerButton
                                            name="addcredit"
                                            quantity={creditAmount}
                                            disabledDecrease={creditAmount > totalBalance}
                                            disabledIncrease={
                                                user?.roleId === 'super_admin'
                                                    ? false
                                                    : creditAmount >= availableBalance + params.balance
                                            }
                                            onChangeCredit={(e) => setCreditAmount(e)}
                                            onIncrease={depositCredit}
                                            onDecrease={withdrawCredit}
                                        />
                                    </Stack>
                                </Stack>

                                <Stack direction="row" alignItems="center">
                                    <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                                        Add Fido
                                    </Typography>

                                    <Stack spacing={1}>
                                        <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
                                            Fido Available:{' '}
                                            {user?.roleId === 'super_admin' ? '∞' : availableFido + params.fidoAmount}
                                        </Typography>
                                        <IncrementerButton
                                            name="addfido"
                                            quantity={fidoAmount}
                                            disabledDecrease={fidoAmount >= params.fidoAmount}
                                            disabledIncrease={
                                                user?.roleId === 'super_admin'
                                                    ? false
                                                    : fidoAmount >= availableFido + params.fidoAmount
                                            }
                                            onChangeCredit={(e) => setFidoAmount(e)}
                                            onIncrease={depositFido}
                                            onDecrease={withdrawFido}
                                        />
                                    </Stack>
                                </Stack>
                                <RHFTextField
                                    name="note"
                                    label="Note"
                                    error={note === ''}
                                    helperText={note === '' ? 'Note required' : ''}
                                    value={note === 0 ? '' : note}
                                    onChange={(e) => {
                                        setNote(e.target.value);
                                    }}
                                />
                                <RHFTextField name="displayName" label="Name" />
                                <RHFTextField name="email" label="Email Address" />
                                <RHFSelect
                                    fullWidth
                                    name="timezone"
                                    label="Time Zone"
                                    InputLabelProps={{ shrink: true }}
                                    PaperPropsSx={{ textTransform: 'capitalize' }}
                                >
                                    {['UTC', 'pending', 'overdue', 'draft'].map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </RHFSelect>
                                <RHFSelect
                                    fullWidth
                                    name="currency"
                                    label="Currency"
                                    InputLabelProps={{ shrink: true }}
                                    PaperPropsSx={{ textTransform: 'capitalize' }}
                                >
                                    {['EUR', 'USD', 'TND'].map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </RHFSelect>

                                <RHFTextField name="ip_address" disabled label="Ip address" />
                                <RHFTextField name="last_login" disabled label="Last Login" />
                            </Box>

                            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                    Save Changes
                                </LoadingButton>
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid container xs={12} md={12} lg={4}>
                        <Grid xs={12} md={6} lg={12}>
                            <BestCharts
                                title="Best Categories"
                                chart={{
                                    series: [
                                        { label: 'Pragmatic Play', value: 4344 },
                                        { label: 'Evolution', value: 5435 },
                                        { label: 'Amatic', value: 1443 },
                                        { label: 'NetEnt', value: 4443 },
                                        { label: 'Playtech', value: 4443 }
                                    ]
                                }}
                            />
                        </Grid>
                        <Grid xs={12} md={6} lg={12}>
                            <BestCharts
                                title="Best Categories"
                                chart={{
                                    series: [
                                        { label: 'Pragmatic Play', value: 4344 },
                                        { label: 'Evolution', value: 5435 },
                                        { label: 'Amatic', value: 1443 },
                                        { label: 'NetEnt', value: 4443 },
                                        { label: 'Playtech', value: 4443 }
                                    ]
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container xs={12} md={12} lg={12} pt={4}>
                    <Grid xs={2}>Family</Grid>
                    <Grid xs={10}>
                        <Stack
                            alignItems="center"
                            flexDirection="row"
                            sx={{
                                bgcolor: 'background.neutral',
                                padding: '4px 10px',
                                borderRadius: '8px'
                            }}
                        >
                            {family.map((item, index) => (
                                <Typography key={index}>
                                    {index > 0 && '>'} {item}
                                </Typography>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>
            </Card>
        </FormProvider>
    );
}
