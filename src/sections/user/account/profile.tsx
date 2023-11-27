import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
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

// utils
import { fData } from 'src/utils/format-number';
import { IUserItem } from 'src/types/user';
import { update, getFamily } from 'src/api';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUploadAvatar, RHFSelect } from 'src/components/hook-form';

import BestCharts from './account-profile/best-charts';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();
    const params: IUserItem = location.state;
    const [family, setFamily] = useState<string[]>([]);

    const UpdateUserSchema = Yup.object().shape({
        displayName: Yup.string().required('Name is required'),
        email: Yup.string().required('Email is required').email('Email must be a valid email address'),
        photoURL: Yup.mixed<any>().nullable().required('Avatar is required'),
        currency: Yup.string().required('Currency is required'),
        timezone: Yup.string().required('timezone is required'),
        ip_address: Yup.string().required('City is required'),
        last_login: Yup.string().required('Zip code is required'),
        credit: Yup.number()
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
        ip_address: '78.453.276.12',
        last_login: '16/09/2023 11:00pm',
        credit: params.balance
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
            formData.append('timezone', data.timezone);
            formData.append('currency', data.currency);

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
                                <RHFTextField name="credit" label="Credit" disabled />
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
        </FormProvider>
    );
}
