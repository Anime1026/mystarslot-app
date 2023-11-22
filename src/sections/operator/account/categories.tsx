import { useForm, Controller } from 'react-hook-form';
// @mui
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useEffect, useState } from 'react';
// components
import { getCategories } from 'src/api';
// ----------------------------------------------------------------------

const NOTIFICATIONS = [
    {
        status: 'sports',
        data: 'Sports'
    },
    {
        status: 'sportsLive',
        data: 'Sports Live'
    },
    {
        status: 'casino',
        data: 'Casino'
    },
    {
        status: 'liveCasino',
        data: 'Live Casino'
    },
    {
        status: 'virtual',
        data: 'Virtual'
    },
    {
        status: 'racing',
        data: 'Racing'
    },
    {
        status: 'esports',
        data: 'E-sports'
    },
    {
        status: 'tournaments',
        data: 'Tournaments'
    }
];

// ----------------------------------------------------------------------

export default function AccountNotifications() {
    const [selectedValue, setSelectedValue] = useState([
        'sports',
        'sportsLive',
        'casino',
        'liveCasino',
        'virtual',
        'racing',
        'esports',
        'tournaments'
    ]);

    const methods = useForm({
        defaultValues: {
            selected: selectedValue
        }
    });

    const getData = async () => {
        const result = await getCategories();
        if (result.status) {
            const states = Object.values(result.result[0]);
            states.shift();
            const array = [
                'sports',
                'sportsLive',
                'casino',
                'liveCasino',
                'virtual',
                'racing',
                'esports',
                'tournaments'
            ];
            const sValue = [];
            for (let i = 0; i < states.length; i += 1) {
                if (states[i] === 1) sValue.push(array[i]);
            }
            setSelectedValue(sValue);
        }
    };

    useEffect(() => {
        getData();
    }, []);
    const { watch, control } = methods;

    const values = watch();

    const getSelected = (selectedItems: string[], item: string) =>
        selectedItems.includes(item) ? selectedItems.filter((value) => value !== item) : [...selectedItems, item];

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
                                    justifyContent: 'space-between'
                                }}
                            />
                        )}
                    />
                </Grid>
            ))}
        </Grid>
    );
}
