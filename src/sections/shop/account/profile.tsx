import * as Yup from 'yup';
import { useCallback, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
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
import { update, getFamily, getInOutAmount } from 'src/api';
// utils
import { fData } from 'src/utils/format-number';
import { paths } from 'src/routes/paths';
// components
import { useSnackbar } from 'src/components/snackbar';
import Scrollbar from 'src/components/scrollbar';
import { IUserItem } from 'src/types/user';
import FormProvider, { RHFTextField, RHFUploadAvatar, RHFSelect } from 'src/components/hook-form';

import IncrementerButton from './account-profile/addcredit';
import BestCharts from './account-profile/best-charts';
import TotalCredit from './account-profile/total-credit';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
    const router = useRouter();
    const { user, getMe } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();
    const params: IUserItem = location.state;

    // add credit
    const [values, setCreditAdd] = useState(params.balance);
    const [fido, setFido] = useState(Number(params.fidoAmount));
    const [family, setFamily] = useState<string[]>([]);
    const [availableBalance, setAvailable] = useState(0);
    const [availableFido, setAvaliableFido] = useState(0);
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
    }, [params])

    useEffect(() => {
        getAmounts();
    }, [getAmounts])

    const theme = useTheme();

    const UpdateUserSchema = Yup.object().shape({
        displayName: Yup.string().required('Name is required'),
        email: Yup.string().required('Email is required').email('Email must be a valid email address'),
        photoURL: Yup.mixed<any>().nullable().required('Avatar is required'),
        currency: Yup.string().required('Currency is required'),
        timezone: Yup.string().required('timezone is required'),
        ip_address: Yup.string().required('City is required'),
        last_login: Yup.string().required('Zip code is required'),
        bonus: Yup.string().required('Must select Bonus Percent'),
        casinortp: Yup.string().required('Must select casinortp Percent'),
        virtualrtp: Yup.string().required('Must select virtualrtp Percent'),
        minigamesrtp: Yup.string().required('Must select minigamesrtp Percent')
        // not required
    });

    const defaultValues = {
        displayName: params?.name || '',
        email: params?.email || '',
        photoURL: params?.avatar || null,
        phoneNumber: params?.phoneNumber || '',
        country: params?.country || '',
        address: params?.address || '',
        currency: 'TND',
        timezone: 'UTC',
        ip_address: params?.ipAddress || '78.453.276.12',
        last_login: params?.lastLogin || '16/09/2023 11:00pm',
        bonus: params?.bonus || '5%',
        casinortp: params?.casinortp || '70%',
        virtualrtp: params?.virtualrtp || '70%',
        minigamesrtp: params?.minigamesrtp || '70%'
    };

    const methods = useForm({
        resolver: yupResolver(UpdateUserSchema),
        defaultValues
    });

    const getUserFamily = useCallback(async () => {
        const result = await getFamily(params.userName);
        if (result.status) {
            setFamily(result.data);
        }
    }, [params.userName]);
    useEffect(() => {
        getUserFamily();
    }, [getUserFamily]);

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
            formData.append('balance', String(values));
            formData.append('fido_amount', String(fido));
            formData.append('timezone', data.timezone);
            formData.append('currency', data.currency);
            formData.append('bonus', data.bonus);
            formData.append('casinortp', data.casinortp);
            formData.append('virtualrtp', data.virtualrtp);
            formData.append('minigamesrtp', data.minigamesrtp);
            const result = await update(formData);
            if (result.status) {
                enqueueSnackbar('Update success!');
                await getMe();
                router.push(paths.shop.list);
            }
        } catch (err) {
            console.log(err);
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

    const creditadd = (data: number) => {
        if (user?.roleId === 'super_admin') {
            setCreditAdd(data);
        } else if (availableBalance + params.balance >= parseFloat(data.toString())) {
            setCreditAdd(data);
        } else {
            enqueueSnackbar('credit not enough!', { variant: 'warning' });
        }
    };

    const fidoAdd = (data: number) => {
        console.log()
        if (user?.roleId === 'super_admin') {
            setFido(data);
        } else if (availableFido + params.fidoAmount >= parseFloat(data.toString())) {
            setFido(data);
        } else {
            enqueueSnackbar('credit not enough!', { variant: 'warning' });
        }
    };

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
                            title="Total"
                            percent={100}
                            price={inAmount + outAmount}
                            icon="solar:bill-list-bold-duotone"
                            color={theme.palette.info.main}
                        />

                        <TotalCredit
                            title="In"
                            percent={50}
                            price={inAmount}
                            icon="solar:file-check-bold-duotone"
                            color={theme.palette.success.main}
                        />

                        <TotalCredit
                            title="Out"
                            percent={60}
                            price={outAmount}
                            icon="solar:sort-by-time-bold-duotone"
                            color={theme.palette.warning.main}
                        />

                        <TotalCredit
                            title="User Credit"
                            percent={70}
                            price={params.balance}
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
                                <Stack direction="row">
                                    <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                                        Add Credits
                                    </Typography>

                                    <Stack spacing={1}>
                                        <IncrementerButton
                                            name="addcredit"
                                            quantity={values}
                                            disabledDecrease={values <= 1}
                                            disabledIncrease={user?.roleId === 'super_admin' ? false : values >= availableBalance + params.balance}
                                            onIncrease={(e) => creditadd(e)}
                                            onDecrease={() => setCreditAdd(values - 1)}
                                        />

                                        <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
                                            Available: {user?.roleId === 'super_admin' ? '∞' : availableBalance + params.balance}
                                        </Typography>
                                    </Stack>
                                </Stack>

                                <Stack direction="row">
                                    <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                                        Add Fido
                                    </Typography>

                                    <Stack spacing={1}>
                                        <IncrementerButton
                                            name="addfido"
                                            quantity={fido}
                                            disabledDecrease={fido <= 1}
                                            disabledIncrease={user?.roleId === 'super_admin' ? false : fido >= availableFido + params.fidoAmount}
                                            onIncrease={(e) => fidoAdd(e)}
                                            onDecrease={() => setFido(fido - 1)}
                                        />

                                        <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
                                            Available: {user?.roleId === 'super_admin' ? '∞' : availableFido + params.fidoAmount}
                                        </Typography>
                                    </Stack>
                                </Stack>
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
                                <RHFSelect
                                    fullWidth
                                    name="bonus"
                                    label="Bonus"
                                    InputLabelProps={{ shrink: true }}
                                    PaperPropsSx={{ textTransform: 'capitalize' }}
                                >
                                    {['0%', '5%', '10%', '15%', '20%'].map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </RHFSelect>
                                <RHFSelect
                                    fullWidth
                                    name="casinortp"
                                    label="RTP % Slot"
                                    InputLabelProps={{ shrink: true }}
                                    PaperPropsSx={{ textTransform: 'capitalize' }}
                                >
                                    {['70%', '75%', '80%', '85%', '90%', '95%'].map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </RHFSelect>
                                <RHFSelect
                                    fullWidth
                                    name="virtualrtp"
                                    label="RTP % Virtuals"
                                    InputLabelProps={{ shrink: true }}
                                    PaperPropsSx={{ textTransform: 'capitalize' }}
                                >
                                    {['70%', '75%', '80%', '85%', '90%', '95%'].map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </RHFSelect>
                                <RHFSelect
                                    fullWidth
                                    name="minigamesrtp"
                                    label="RTP % Mini Games"
                                    InputLabelProps={{ shrink: true }}
                                    PaperPropsSx={{ textTransform: 'capitalize' }}
                                >
                                    {['70%', '75%', '80%', '85%', '90%', '95%'].map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </RHFSelect>
                                {/* <RHFTextField name="phoneNumber" label="Phone Number" />
              <RHFTextField name="address" label="Address" /> */}
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
                                    {index > 0 && ' >'} {item}
                                </Typography>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>
            </Card>
        </FormProvider>
    );
}
