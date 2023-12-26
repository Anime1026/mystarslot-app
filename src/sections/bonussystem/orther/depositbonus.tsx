import * as Yup from 'yup';
import { useEffect, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';

import InputAdornment from '@mui/material/InputAdornment';

// hooks
import { useAuthContext } from 'src/auth/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
import { bonusSetting, getBonusSetting } from 'src/api';

// utils
// import { fcustomCurrency } from 'src/utils/format-number';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const UpdateUserSchema = Yup.object().shape({
    status: Yup.string().optional(),
    FirstBonus: Yup.number().min(0).max(5).required('Bonus Min and Max balance is wrong'),
    TowBonus: Yup.number().min(5).max(10).required('Bonus Min and Max balance is wrong'),
    ThreeBonus: Yup.number().min(10).max(15).required('Bonus Min and Max balance is wrong'),
    FourBonus: Yup.number().min(15).max(20).required('Bonus Min and Max balance is wrong')
    // not required
});

export default function AccountGeneral() {
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useAuthContext();
    const mdUp = useResponsive('up', 'md');

    const [bonusStatus, setBonusStatus] = useState('');

    const defaultValues = {
        status: 'Enabled',
        FirstBonus: 0,
        TowBonus: 0,
        ThreeBonus: 0,
        FourBonus: 0
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
            console.log(data, '--data--', bonusStatus);
            const reqData = {
                status: bonusStatus,
                first: data.FirstBonus,
                two: data.TowBonus,
                three: data.ThreeBonus,
                four: data.FourBonus
            };
            const result = await bonusSetting(reqData);
            enqueueSnackbar(result.data);
        } catch (error) {
            console.error(error);
        }
    });

    const init = useCallback(async () => {
        try {
            const result = await getBonusSetting();
            setValue('status', result.data.status);
            setValue('FirstBonus', result.data.first);
            setValue('TowBonus', result.data.two);
            setValue('ThreeBonus', result.data.three);
            setValue('FourBonus', result.data.four);
            setBonusStatus(result.data.status);
        } catch (error) {
            console.log(error);
        }
    }, [setValue]);

    useEffect(() => {
        init();
    }, [init]);

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={4}>
                <Grid xs={12} md={8} lg={8}>
                    <Card sx={{ p: 5 }}>
                        <Grid container spacing={4}>
                            <Grid xs={12} md={8} lg={8}>
                                <Stack direction="row" alignItems="center" gap={15}>
                                    <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                                        Status
                                    </Typography>
                                    <RHFSelect
                                        name="status"
                                        variant="standard"
                                        value={bonusStatus}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(e) => setBonusStatus(e.target.value)}
                                        PaperPropsSx={{ textTransform: 'capitalize' }}
                                        disabled={user?.roleId !== 'super_admin'}
                                    >
                                        {['Enabled', 'Disabled'].map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </RHFSelect>
                                </Stack>
                            </Grid>
                            <Grid xs={12} md={12} lg={12} sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}>
                                <Stack direction="row" alignItems="center">
                                    <Typography variant="subtitle2" sx={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
                                        5 ... 19.99
                                    </Typography>

                                    <RHFTextField
                                        name="FirstBonus"
                                        placeholder="0,00"
                                        variant="standard"
                                        type="number"
                                        label="MAX 5%"
                                        disabled={bonusStatus === 'Disabled'}
                                        sx={{ maxWidth: mdUp ? 300 : 150 }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>
                                                        %
                                                    </Box>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Stack>

                                <Stack direction="row" alignItems="center">
                                    <Typography variant="subtitle2" sx={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
                                        20 ... 49.99
                                    </Typography>

                                    <RHFTextField
                                        name="TowBonus"
                                        placeholder="0,00"
                                        variant="standard"
                                        type="number"
                                        label="MAX 10%"
                                        sx={{ maxWidth: mdUp ? 300 : 150 }}
                                        disabled={bonusStatus === 'Disabled'}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>
                                                        %
                                                    </Box>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Stack>

                                <Stack direction="row" alignItems="center">
                                    <Typography variant="subtitle2" sx={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
                                        50 ... 99.99
                                    </Typography>

                                    <RHFTextField
                                        name="ThreeBonus"
                                        placeholder="0,00"
                                        variant="standard"
                                        type="number"
                                        label="MAX 15%"
                                        sx={{ maxWidth: mdUp ? 300 : 150 }}
                                        disabled={bonusStatus === 'Disabled'}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>
                                                        %
                                                    </Box>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Stack>

                                <Stack direction="row" alignItems="center">
                                    <Typography variant="subtitle2" sx={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
                                        100 ... INF
                                    </Typography>

                                    <RHFTextField
                                        name="FourBonus"
                                        placeholder="0,00"
                                        variant="standard"
                                        type="number"
                                        label="MAX 20%"
                                        sx={{ maxWidth: mdUp ? 300 : 150 }}
                                        disabled={bonusStatus === 'Disabled'}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>
                                                        %
                                                    </Box>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>

                        <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                Save Changes
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
