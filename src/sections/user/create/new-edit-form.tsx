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
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
// utils
import { fData } from 'src/utils/format-number';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// api
import { create } from 'src/api';
// types
import { IUserItem } from 'src/types/user';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

type Props = {
    currentUser?: IUserItem;
};

export default function UserNewEditForm({ currentUser }: Props) {
    const router = useRouter();
    const password = useBoolean();

    const { enqueueSnackbar } = useSnackbar();

    const NewUserSchema = Yup.object().shape({
        name: Yup.string().optional(),
        email: Yup.string().optional().email('Email must be a valid email address'),
        telephone: Yup.string().optional(),
        city: Yup.string().optional(),
        state: Yup.string().optional(),
        avatar: Yup.mixed<any>().nullable().optional(),
        password: Yup.string().min(6).required('password is required'),
        confirmPassword: Yup.string().min(6).required('Confirm Password is required'),
        username: Yup.string().required('UserName is required'),
        // not required
        isVerified: Yup.boolean()
    });

    const methods = useForm({
        resolver: yupResolver(NewUserSchema),
        defaultValues: {
            name: '',
            email: '',
            avatar: null,
            username: '',
            password: '',
            confirmPassword: '',
            telephone: '',
            city: '',
            state: '',
            isVerified: true
        }
    });

    const {
        reset,
        setValue,
        handleSubmit,
        formState: { isSubmitting }
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (data.confirmPassword === data.password) {
                const formData = new FormData();
                formData.append('image', data.avatar);
                formData.append('password', data.password);
                formData.append('userName', data.username);
                formData.append('roleId', 'user');

                formData.append('email', data.email || '');
                formData.append('name', data.name || '');
                formData.append('phoneNumber', data.telephone || '');
                formData.append('city', data.city || '');
                formData.append('state', data.state || '');

                const result = await create(formData);
                if (result.status) {
                    reset();
                    enqueueSnackbar('Create success!');
                    router.push(paths.user.list);
                } else {
                    enqueueSnackbar(result.message, { variant: 'error' });
                }
            } else {
                enqueueSnackbar('Please check password', { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    });

    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];

            Object.assign(file, {
                preview: URL.createObjectURL(file)
            });

            if (file) {
                setValue('avatar', file, { shouldValidate: true });
            }
        },
        [setValue]
    );

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
                <Grid xs={12} md={4}>
                    <Card sx={{ pt: 10, pb: 5, px: 3 }}>
                        <Box sx={{ mb: 5 }}>
                            <RHFUploadAvatar
                                name="avatar"
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
                        </Box>

                        <RHFSwitch
                            name="isVerified"
                            labelPlacement="start"
                            label={
                                <>
                                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                        Email Verified
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Disabling this will automatically send the user a verification email
                                    </Typography>
                                </>
                            }
                            sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                        />

                        {currentUser && (
                            <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                                <Button variant="soft" color="error">
                                    Delete User
                                </Button>
                            </Stack>
                        )}
                    </Card>
                </Grid>

                <Grid xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Grid container spacing={2}>
                            <Grid md={6}>
                                <Box rowGap={3} columnGap={2} display="grid">
                                    <RHFTextField name="username" label="username" />
                                    <RHFTextField name="email" label="Email Address" autoComplete="offs" />
                                    <RHFTextField
                                        autoComplete="new-password"
                                        name="password"
                                        label="New Password"
                                        type={password.value ? 'text' : 'password'}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={password.onToggle} edge="end">
                                                        <Iconify
                                                            icon={
                                                                password.value
                                                                    ? 'solar:eye-bold'
                                                                    : 'solar:eye-closed-bold'
                                                            }
                                                        />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                        helperText={
                                            <Stack component="span" direction="row" alignItems="center">
                                                <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> Password
                                                must be minimum 6+
                                            </Stack>
                                        }
                                    />
                                    <RHFTextField
                                        autoComplete="new-password"
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        type={password.value ? 'text' : 'password'}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={password.onToggle} edge="end">
                                                        <Iconify
                                                            icon={
                                                                password.value
                                                                    ? 'solar:eye-bold'
                                                                    : 'solar:eye-closed-bold'
                                                            }
                                                        />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />

                                    {/* <RHFTextField name="company" label="Assign to " /> */}
                                </Box>
                            </Grid>
                            <Grid md={6}>
                                <Box rowGap={3} columnGap={2} display="grid">
                                    <RHFTextField name="name" label="Full Name" />
                                    <RHFTextField name="telephone" label="TelePhone" autoComplete="offs" />
                                    <RHFTextField name="city" label="City" autoComplete="offs" />
                                    <RHFTextField name="state" label="State" autoComplete="offs" />

                                    {/* <RHFTextField name="company" label="Assign to " /> */}
                                </Box>

                                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                        {!currentUser ? 'Create User' : 'Save Changes'}
                                    </LoadingButton>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
