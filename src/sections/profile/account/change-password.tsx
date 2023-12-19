import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { setSession } from 'src/auth/context/jwt/utils';
import { useSnackbar } from 'src/components/snackbar';

// import { jwtDecode } from 'jwt-decode';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { updateProfile } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useAuthContext();
    const password = useBoolean();
    const confirmPassword = useBoolean();
    const oldPassword = useBoolean();

    const ChangePassWordSchema = Yup.object().shape({
        oldPassword: Yup.string().required('Old password is required'),
        newPassword: Yup.string()
            .required('New Password is required')
            .min(6, 'Password must be at least 6 characters')
            .test(
                'no-match',
                'New password must be different than old password',
                (value, { parent }) => value !== parent.oldPassword
            ),
        confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Passwords must match')
    });

    const defaultValues = {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    };

    const methods = useForm({
        resolver: yupResolver(ChangePassWordSchema),
        defaultValues
    });

    const {
        handleSubmit,
        formState: { isSubmitting }
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            // let userInfo = localStorage.getItem('accessToken');
            const result = await updateProfile({
                oldPassword: data.oldPassword,
                password: data.newPassword,
                id: user?.id
            });
            if (result.status) {
                enqueueSnackbar(result.message);
                setSession(result.accessToken);
            }
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
            console.error(error);
        }
    });

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Stack component={Card} spacing={3} sx={{ p: 3 }}>
                <RHFTextField
                    name="oldPassword"
                    label="Old Password"
                    type={oldPassword.value ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={oldPassword.onToggle} edge="end">
                                    <Iconify icon={oldPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    helperText={
                        <Stack component="span" direction="row" alignItems="center">
                            <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> Password must be minimum 6+
                        </Stack>
                    }
                />
                <RHFTextField
                    name="newPassword"
                    label="New Password"
                    type={password.value ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={password.onToggle} edge="end">
                                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    helperText={
                        <Stack component="span" direction="row" alignItems="center">
                            <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> Password must be minimum 6+
                        </Stack>
                    }
                />

                <RHFTextField
                    name="confirmNewPassword"
                    type={confirmPassword.value ? 'text' : 'password'}
                    label="Confirm New Password"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={confirmPassword.onToggle} edge="end">
                                    <Iconify
                                        icon={confirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                                    />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />

                <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
                    Save Changes
                </LoadingButton>
            </Stack>
        </FormProvider>
    );
}
