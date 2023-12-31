import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RemoveIcon from '@mui/icons-material/Remove';
// add model

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';

// hooks
import { useAuthContext } from 'src/auth/hooks';
// utils
import { fData, fcustomCurrency } from 'src/utils/format-number';
import { update, getFamily, getSelectUser, changeCredit, getBonusSetting } from 'src/api';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUploadAvatar, RHFSelect } from 'src/components/hook-form';

import BestCharts from './account-profile/best-charts';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
    const { enqueueSnackbar } = useSnackbar();
    const params_: any = useParams();
    const { getMe } = useAuthContext();

    const [family, setFamily] = useState<string[]>([]);

    const [open, setOpen] = useState(false);
    const [withdrawopen, setWithdrawOpen] = useState(false);
    const [amountValue, setAmountValue] = useState(0);
    const [bonusCheck, setBonusCheck] = useState(true);

    const [updateUser, setUpdateUser] = useState<any>();

    const [depositTime, setDepositTime] = useState({
        hour: 0,
        minute: 0,
        second: 0
    });

    const [bonus, setBonus] = useState({
        first: 0,
        second: 0,
        third: 0,
        fourth: 0
    });

    const [bonusAvailable, setBonusAvailable] = useState(0);

    const UpdateUserSchema = Yup.object().shape({
        displayName: Yup.string().required('Name is required'),
        email: Yup.string().required('Email is required').email('Email must be a valid email address'),
        photoURL: Yup.mixed<any>().nullable().required('Avatar is required'),
        timezone: Yup.string().optional(),
        ip_address: Yup.string().required(),
        last_login: Yup.string().required('Zip code is required'),
        credit: Yup.string().optional()
    });

    const defaultValues = {
        displayName: '',
        email: '',
        photoURL: null,
        phoneNumber: '',
        country: '',
        address: '',
        timezone: 'UTC',
        ip_address: '78.453.276.12',
        last_login: '16/09/2023 11:00pm',
        credit: '0'
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

    const init = useCallback(async () => {
        const initSelectUser = await getSelectUser({ id: params_.id });
        setUpdateUser(initSelectUser.data);
    }, [params_]);

    const getUserFamily = useCallback(async () => {
        if (updateUser) {
            const updateDate = new Date(updateUser.updatedAt);

            setValue('displayName', updateUser.username);
            setValue('credit', fcustomCurrency(updateUser.balance));
            setValue('email', updateUser.email);
            setValue('photoURL', updateUser.avatar);
            setValue('ip_address', updateUser.ip_address);
            setValue('last_login', format(updateDate, 'yyyy-MM-dd h:mm:ss'));

            const result = await getFamily(updateUser.username);
            setFamily(result.data);
            if (result.status) {
                console.log(result, '---time.result---');
                if (24 - result.difTime.hour <= 0) {
                    const bonusResult = await getBonusSetting();
                    console.log(bonusResult.data, 'bonusResult.data.');
                    if (bonusResult.data.status === 'Enabled') {
                        setBonus({
                            first: bonusResult.data.first,
                            second: bonusResult.data.two,
                            third: bonusResult.data.three,
                            fourth: bonusResult.data.four
                        });
                    }
                    setDepositTime({
                        hour: 0,
                        minute: 0,
                        second: 0
                    });
                } else {
                    setDepositTime({
                        hour: 23 - result.difTime.hour,
                        minute: 59 - result.difTime.minute,
                        second: 59 - result.difTime.second
                    });
                }
            }
        }
    }, [updateUser, setValue, setFamily]);

    useEffect(() => {
        getUserFamily();
    }, [getUserFamily]);

    useEffect(() => {
        init();
    }, [init]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const formData = new FormData();
            formData.append('image', data.photoURL);
            formData.append('id', updateUser.id);
            formData.append('username', data.displayName);
            formData.append('email', data.email);
            // formData.append('timezone', data.timezone);

            const result = await update(formData);
            if (result.status) {
                enqueueSnackbar('Update success!');
            }
        } catch (error) {
            console.log(error);
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

    // add credit

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setWithdrawOpen(false);
        setOpen(false);
    };

    const handleWithdrawCredit = async () => {
        setWithdrawOpen(true);
    };

    // const deposithandle = () => {
    //     console.log();
    // };

    const depositCredit = async () => {
        console.log(amountValue, 'amountValue.amountValue');
        if (amountValue > 0) {
            const result = await changeCredit({
                balance: amountValue,
                type: 'deposit',
                bonus: amountValue * (bonusCheck ? bonusAvailable / 100 : 1),
                username: updateUser.username,
                note: ''
            });
            if (result.status) {
                await getMe();
                setAmountValue(0);
                enqueueSnackbar(result.message);
            } else {
                enqueueSnackbar(result.message, { variant: 'error' });
            }
        }
        init();
    };

    const withdrawCredit = async () => {
        if (window.confirm('Upon withdrawal, the bonus balance is reset.')) {
            if (amountValue > 0) {
                console.log(amountValue, 'amountValue.withdraw');
                const result = await changeCredit({
                    balance: amountValue,
                    type: 'withdraw',
                    username: updateUser.username,
                    note: ''
                });
                await getMe();
                setAmountValue(0);
                enqueueSnackbar(result.message);
            }
            init();
        }
    };

    const handleAmount = (amount: number) => {
        if (amount >= 5 && amount < 20) {
            setBonusAvailable(bonus.first);
        } else if (amount >= 20 && amount < 50) {
            setBonusAvailable(bonus.second);
        } else if (amount >= 50 && amount < 100) {
            setBonusAvailable(bonus.third);
        } else if (amount >= 100) {
            setBonusAvailable(bonus.fourth);
        }

        setAmountValue(amount);
    };

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
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
                                <RHFTextField
                                    name="credit"
                                    label="credit"
                                    disabled
                                    sx={{
                                        '& input': {
                                            textAlign: 'center'
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <RemoveIcon onClick={handleWithdrawCredit} sx={{ cursor: 'pointer' }} />
                                        ),
                                        endAdornment: <AddIcon onClick={handleClickOpen} sx={{ cursor: 'pointer' }} />
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
                                    disabled
                                >
                                    {['UTC', 'pending', 'overdue', 'draft'].map((option) => (
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
                                title="Best 5 Shops"
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
            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle>Add Credit</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth variant="filled">
                        <InputLabel htmlFor="filled-adornment-amount">Amount</InputLabel>
                        <FilledInput
                            id="filled-adornment-amount"
                            type="number"
                            onChange={(e) => {
                                handleAmount(Number(e.target.value));
                            }}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        />
                    </FormControl>
                    <FormControlLabel
                        labelPlacement="start"
                        control={
                            <Checkbox
                                defaultChecked
                                onChange={(e) => {
                                    setBonusCheck(e.target.checked);
                                }}
                            />
                        }
                        label="BonusBack"
                    />
                    <Box component="span" paddingLeft={2}>
                        {bonusCheck ? fcustomCurrency(amountValue * (bonusAvailable / 100)) : 0}
                    </Box>
                    {depositTime.hour === 0 && depositTime.second === 0 && depositTime.minute === 0 ? (
                        <Typography sx={{ fontSize: 12, p: 2 }}>
                            Deposit Bonus Available. You can get Bonus on deposit.
                        </Typography>
                    ) : (
                        <Typography color="error" sx={{ fontSize: 12, p: 2 }}>
                            The bonus can be received {depositTime.hour} hours {depositTime.minute} minutes{' '}
                            {depositTime.second} seconds after depositing.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button color="success" variant="outlined" onClick={depositCredit}>
                        Deposit
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={withdrawopen} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle>Withdraw Credit</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth variant="filled">
                        <InputLabel htmlFor="filled-adornment-amount">Amount</InputLabel>
                        <FilledInput
                            id="filled-adornment-amount"
                            type="number"
                            onChange={(e) => {
                                setAmountValue(Number(e.target.value));
                            }}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button color="error" variant="outlined" onClick={withdrawCredit}>
                        Withdraw
                    </Button>
                </DialogActions>
            </Dialog>
        </FormProvider>
    );
}
