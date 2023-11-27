import * as Yup from 'yup';
import { useCallback } from 'react';
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

// hooks
import { useAuthContext } from 'src/auth/hooks';
import { update } from 'src/api';
// utils
import { fData } from 'src/utils/format-number';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUploadAvatar, RHFSelect } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useAuthContext();

    const UpdateUserSchema = Yup.object().shape({
        displayName: Yup.string().required('Name is required'),
        email: Yup.string().required('Email is required').email('Email must be a valid email address'),
        photoURL: Yup.mixed().nullable().required('Avatar is required'),
        currency: Yup.string().required('Currency is required'),
        timezone: Yup.string().required('timezone is required'),
        ip_address: Yup.string().required('City is required'),
        last_login: Yup.string().required('Zip code is required'),
        credit: Yup.mixed().required('Credit is required'),
        // not required
        role: Yup.string().required('Role is required')
    });

    console.log(user?.roleId);

    const defaultValues = {
        displayName: user?.username || '',
        email: user?.email || '',
        photoURL: user?.avatar || null,
        currency: 'TND',
        timezone: 'UTC',
        ip_address: '78.453.276.12',
        last_login: '16/09/2023 11:00pm',
        credit: user?.roleId === 'super_admin' ? '∞' : user?.balance,
        role: user?.roleId === 'super_admin' ? 'Super Admin' : user?.roleId || ''
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
            formData.append('id', user?.id);
            formData.append('username', data.displayName);
            formData.append('email', data.email);
            formData.append('timezone', data.timezone);
            formData.append('currency', data.currency);
            const result = await update(formData);
            if (result.status) {
                enqueueSnackbar('Update success!');
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

    // add credit

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            {/* <Card
        sx={{
          mb: { xs: 1, md: 3 },
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
              price={123}
              icon="solar:bill-list-bold-duotone"
              color={theme.palette.info.main}
            />

            <TotalCredit
              title="In"
              percent={50}
              price={50}
              icon="solar:file-check-bold-duotone"
              color={theme.palette.success.main}
            />

            <TotalCredit
              title="Out"
              percent={60}
              price={60}
              icon="solar:sort-by-time-bold-duotone"
              color={theme.palette.warning.main}
            />

            <TotalCredit
              title="User Credit"
              percent={70}
              price={75}
              icon="solar:file-corrupted-bold-duotone"
              color={theme.palette.error.main}
            />
          </Stack>
        </Scrollbar>
      </Card> */}

            <Card sx={{ p: 3 }}>
                <Grid container spacing={4}>
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

                    <Grid xs={12} md={6} lg={8}>
                        <Card sx={{ p: 3 }}>
                            <Box
                                rowGap={3}
                                columnGap={2}
                                display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)'
                                }}
                            >
                                <RHFTextField name="displayName" label="Name" />
                                <RHFTextField name="email" label="Email Address" />
                                <RHFTextField name="credit" label="Credit" disabled />
                                <RHFTextField name="role" label="Role" disabled />
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
                </Grid>
            </Card>
        </FormProvider>
    );
}
