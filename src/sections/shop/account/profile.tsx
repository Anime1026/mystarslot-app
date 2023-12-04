import * as Yup from 'yup';
import { format } from 'date-fns';
import { useCallback, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
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
import { update, getFamily, getInOutAmount, changeCredit, changeFido, getUserTotalValue, getSelectUser } from 'src/api';
// utils
// utils
import { fData, fcustomCurrency } from 'src/utils/format-number';
import { paths } from 'src/routes/paths';
// components
import { useSnackbar } from 'src/components/snackbar';
import Scrollbar from 'src/components/scrollbar';
import FormProvider, { RHFTextField, RHFUploadAvatar, RHFSelect } from 'src/components/hook-form';

import IncrementerButton from './account-profile/addcredit';
import BestCharts from './account-profile/best-charts';
import TotalCredit from './account-profile/total-credit';

// ----------------------------------------------------------------------

const UpdateUserSchema = Yup.object().shape({
    displayName: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    photoURL: Yup.mixed<any>().nullable().required('Avatar is required'),
    timezones: Yup.string().optional(),
    ip_address: Yup.string().optional(),
    last_login: Yup.string().required('Zip code is required'),
    casinortp: Yup.string().required('Must select casinortp Percent'),
    virtualrtp: Yup.string().required('Must select virtualrtp Percent'),
    minigamesrtp: Yup.string().required('Must select minigamesrtp Percent')
    // not required
});

export default function AccountGeneral() {
    const router = useRouter();
    const theme = useTheme();

    const { user, getMe } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const params_: any = useParams();
    // add credit
    const [family, setFamily] = useState<string[]>([]);
    const [availableBalance, setAvailable] = useState(0);
    const [availableFido, setAvaliableFido] = useState(0);
    const [inAmount, setInAmount] = useState(0);
    const [outAmount, setOutAmount] = useState(0);

    const [totalBalance, setTotalBalance] = useState(0);
    const [creditAmount, setCreditAmount] = useState(0);

    // add fido

    const [fidoAmount, setFidoAmount] = useState(0);
    const [note, setNote] = useState<0 | string>(0);

    const [updateUser, setUpdateUser] = useState<any>();

    const init = useCallback(async () => {
        const initSelectUser = await getSelectUser({ id: params_.id });
        setUpdateUser(initSelectUser.data);
    }, [params_]);

    // const updateDate = new Date(params?.lastLogin);

    const defaultValues = {
        displayName: '',
        email: '',
        photoURL: null,
        phoneNumber: '',
        country: '',
        address: '',
        timezones: 'UTC',
        ip_address: '78.453.276.12',
        last_login: '16/09/2023 11:00pm',
        casinortp: '70%',
        virtualrtp: '70%',
        minigamesrtp: '70%'
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

    const [userTotal, setUserTotal] = useState(0);
    const getAmounts = useCallback(async () => {
        if (updateUser) {
            const updateDate = new Date(updateUser.updatedAt);
            setValue('displayName', updateUser.username);
            setValue('email', updateUser.email);
            setValue('photoURL', updateUser.avatar);
            setValue('timezones', updateUser.timezone);
            setValue('last_login', format(updateDate, 'yyyy-MM-dd h:mm:ss'));
            setValue('ip_address', updateUser.ip_address);
            setValue('casinortp', updateUser.casinortp);
            setValue('virtualrtp', updateUser.virtualrtp);
            setValue('minigamesrtp', updateUser.minigamesrtp);

            const result = await getInOutAmount({ userName: updateUser.username });
            if (result.status) {
                setInAmount(result.inAmount);
                setOutAmount(result.outAmount);
            }

            setTotalBalance(updateUser.balance || 0);
            const data = await getUserTotalValue({ userid: updateUser.username, type: 'user' });
            setUserTotal(data.totalvalue);

            const result_ = await getFamily(updateUser.username);
            if (result_.status) {
                setFamily(result_.data);
            }
        }
    }, [updateUser, setValue]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const formData = new FormData();
            formData.append('image', data.photoURL);
            formData.append('id', updateUser.id);
            formData.append('username', data.displayName);
            formData.append('email', data.email);
            // formData.append('timezone', data.timezone);
            // formData.append('currency', data.currency);
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

    const depositCredit = async () => {
        if (note === 0 || note === '') {
            setNote('');
        } else {
            if (creditAmount > 0) {
                const result = await changeCredit({
                    balance: creditAmount,
                    type: 'deposit',
                    username: updateUser.username,
                    note
                });
                await getMe();
                setTotalBalance((preTotalbalance) => Number(preTotalbalance) + Number(creditAmount));
                setCreditAmount(0);
                enqueueSnackbar(result.message);
            }
            init();
        }
    };

    const withdrawCredit = async () => {
        if (note === 0 || note === '') {
            setNote('');
        } else {
            if (creditAmount > 0) {
                const result = await changeCredit({
                    balance: creditAmount,
                    type: 'withdraw',
                    username: updateUser.username,
                    note
                });
                await getMe();
                setTotalBalance((preTotalbalance) => Number(preTotalbalance) - Number(creditAmount));
                setCreditAmount(0);
                enqueueSnackbar(result.message);
            }
            init();
        }
    };

    const depositFido = async () => {
        if (note === 0 || note === '') {
            setNote('');
        } else {
            if (fidoAmount > 0) {
                const result = await changeFido({
                    balance: fidoAmount,
                    type: 'deposit',
                    username: updateUser.username,
                    note
                });
                enqueueSnackbar(result.message);
                setFidoAmount(0);
            }
            init();
        }
    };

    const withdrawFido = async () => {
        if (note === 0 || note === '') {
            setNote('');
        } else {
            if (fidoAmount > 0) {
                const result = await changeFido({
                    balance: fidoAmount,
                    type: 'withdraw',
                    username: updateUser.username,
                    note
                });
                enqueueSnackbar(result.message);
                setFidoAmount(0);
            }
            init();
        }
    };

    useEffect(() => {
        init();
    }, [init]);

    useEffect(() => {
        getAmounts();
    }, [getAmounts]);

    useEffect(() => {
        if (user) {
            setAvailable(user.balance);
            setAvaliableFido(user.fido_amount);
        }
    }, [user]);

    return (
        <>
            {updateUser && (
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
                                    title="IN"
                                    percent={(outAmount / (inAmount + outAmount)) * 100}
                                    price={outAmount}
                                    icon="solar:file-check-bold-duotone"
                                    color={theme.palette.success.main}
                                />

                                <TotalCredit
                                    title="OUT"
                                    percent={(inAmount / (inAmount + outAmount)) * 100}
                                    price={inAmount}
                                    icon="solar:sort-by-time-bold-duotone"
                                    color={theme.palette.warning.main}
                                />

                                <TotalCredit
                                    title="SUM"
                                    percent={100}
                                    price={outAmount - inAmount}
                                    icon="solar:bill-list-bold-duotone"
                                    color={theme.palette.info.main}
                                />

                                <TotalCredit
                                    title="PLAYER CREDIT"
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
                                                <Typography
                                                    variant="caption"
                                                    component="div"
                                                    sx={{ textAlign: 'right' }}
                                                >
                                                    Credit Available: {fcustomCurrency(updateUser.balance)}
                                                </Typography>
                                                <IncrementerButton
                                                    name="addcredit"
                                                    quantity={creditAmount}
                                                    disabledDecrease={creditAmount >= totalBalance}
                                                    disabledIncrease={
                                                        user?.roleId === 'super_admin'
                                                            ? false
                                                            : creditAmount >= availableBalance + updateUser.balance
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
                                                <Typography
                                                    variant="caption"
                                                    component="div"
                                                    sx={{ textAlign: 'right' }}
                                                >
                                                    Fido Available: {fcustomCurrency(updateUser.fido_amount)}
                                                </Typography>
                                                <IncrementerButton
                                                    name="addfido"
                                                    quantity={fidoAmount}
                                                    disabledDecrease={fidoAmount >= updateUser.fido_amount}
                                                    disabledIncrease={
                                                        user?.roleId === 'super_admin'
                                                            ? false
                                                            : fidoAmount >= availableFido + updateUser.fido_amount
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

                                        <RHFTextField disabled name="timezones" label="Time Zone" />

                                        <RHFTextField name="ip_address" disabled label="Ip address" />
                                        <RHFTextField name="last_login" disabled label="Last Login" />
                                        {/* <RHFSelect
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
                                </RHFSelect> */}
                                        <RHFSelect
                                            fullWidth
                                            name="casinortp"
                                            label="RTP % Slot"
                                            InputLabelProps={{ shrink: true }}
                                            PaperPropsSx={{ textTransform: 'capitalize' }}
                                            disabled={user?.roleId !== 'super_admin'}
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
                                            disabled={user?.roleId !== 'super_admin'}
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
                                            disabled={user?.roleId !== 'super_admin'}
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
            )}
        </>
    );
}
