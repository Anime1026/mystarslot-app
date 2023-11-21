import * as Yup from 'yup';
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
import { getInOutAmount, update } from 'src/api';

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
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const location = useLocation();
  const params: IUserItem = location.state;

  const theme = useTheme();

  // add credit
  const [values, setCreditAdd] = useState(params.balance);
  const [fido, setFido] = useState(Number(params.fidoAmount));
  const [availableBalance, setAvailable] = useState(0);
  const [availableFido, setAvaliableFido] = useState(0);
  const availableCredit = 150;

  useEffect(() => {
    if (user) {
      setAvailable(user.balance);
      setAvaliableFido(user.fido_amount);
    }
  }, [user])

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

  const defaultValues = {
    displayName: params?.name || '',
    email: params?.email || '',
    photoURL: params?.avatar || null,
    currency: 'TND',
    timezone: 'UTC',
    ip_address: params?.ipAddress || '78.453.276.12',
    last_login: params?.lastLogin || '16/09/2023 11:00pm'
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
      formData.append('balance', String(values));
      formData.append('fido_amount', String(fido));
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

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('photoURL', file, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const creditadd = (data: number) => {
    if (availableBalance >= parseFloat(data.toString())) {
      setCreditAdd(data);
    } else {
      console.log(data, 'data', values);
      enqueueSnackbar('credit not enough!', { variant: 'warning' });
    }
  };

  const fidoAdd = (data: number) => {
    if (availableFido >= parseFloat(data.toString())) {
      setFido(data);
    } else {
      console.log(data, 'data', values);
      enqueueSnackbar('credit not enough!', { variant: 'warning' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card
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
                      disabledIncrease={values >= availableBalance}
                      onIncrease={(e) => creditadd(e)}
                      onDecrease={() => setCreditAdd(values - 1)}
                    />

                    <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
                      Available: {availableBalance}
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
                      disabledIncrease={fido >= availableFido}
                      onIncrease={(e) => fidoAdd(e)}
                      onDecrease={() => setFido(fido - 1)}
                    />

                    <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
                      Available: {availableFido}
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
          {/* <Grid xs={12} md={6} lg={8} container spacing={2}>
            <Grid xs={12} md={12} lg={12}>
              <BestCategories title="Best 5 Providers" data={_ecommerceSalesOverview} />
            </Grid>
            <Grid xs={12} md={12} lg={12}>
              <BestCategories title="Best 5 Games" data={_ecommerceSalesOverview} />
            </Grid>
          </Grid>
          <Grid xs={12} md={6} lg={4}>
            <TotalUsers
              title="Oprator Total Credit"
              chart={{
                series: [
                  { label: 'In Credit', value: 12244 },
                  { label: 'Out Credit', value: 53345 },
                  { label: 'Total', value: 44313 },
                  { label: 'User Credit', value: 78343 },
                ],
              }}
            />
          </Grid> */}
        </Grid>
      </Card>
    </FormProvider>
  );
}
