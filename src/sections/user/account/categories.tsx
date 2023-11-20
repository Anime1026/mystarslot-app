import { useForm, Controller } from 'react-hook-form';
// @mui
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import FormControlLabel from '@mui/material/FormControlLabel';
// components

// ----------------------------------------------------------------------

const NOTIFICATIONS = [
  {
    status: '1',
    data: 'Sports',
  },
  {
    status: '2',
    data: 'Sports Live',
  },
  {
    status: '3',
    data: 'Casino',
  },
  {
    status: '4',
    data: 'Live Casino',
  },
  {
    status: '5',
    data: 'Virtual',
  },
  {
    status: '6',
    data: 'Racing',
  },
  {
    status: '7',
    data: 'E-sports',
  },
  {
    status: '8',
    data: 'Tournaments',
  },
];

// ----------------------------------------------------------------------

export default function AccountNotifications() {
  const methods = useForm({
    defaultValues: {
      selected: ['1', '2', '3', '4', '5', '6', '7', '8'],
    },
  });

  const { watch, control } = methods;

  const values = watch();

  const getSelected = (selectedItems: string[], item: string) =>
    selectedItems.includes(item)
      ? selectedItems.filter((value) => value !== item)
      : [...selectedItems, item];

  return (
    <Grid container spacing={6}>
      {NOTIFICATIONS.map((notification, key) => (
        <Grid xs={12} md={6} key={key}>
          <Controller
            name="selected"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                title={field.value.includes(notification.status) ? 'Enable' : 'Disable'}
                label={notification.data}
                labelPlacement="start"
                control={
                  <Switch
                    checked={field.value.includes(notification.status)}
                    onChange={() =>
                      field.onChange(getSelected(values.selected, notification.status))
                    }
                  />
                }
                sx={{
                  m: 0,
                  width: 1,
                  justifyContent: 'space-between',
                }}
              />
            )}
          />
        </Grid>
      ))}
    </Grid>
  );
}
