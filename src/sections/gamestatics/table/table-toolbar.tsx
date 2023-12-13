import { useCallback, useEffect, useState } from 'react';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';

// types
import { IOrderTableFilters, IOrderTableFilterValue } from 'src/types/order';

// apis
import { getCategories, getProviders } from 'src/api';

// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
    filters: IOrderTableFilters;
    onFilters: (name: string, value: IOrderTableFilterValue) => void;
    //
    canReset: boolean;
    onResetFilters: VoidFunction;
};

// const categories = ['Casino', 'Live Casino', 'Sports', 'Live Sports', 'Virtual', 'Racing', 'E-Sports'];
// const providers = ['netent', 'novomatic', 'amatic', 'Igt', 'habanero', 'bomba', 'aviatar'];

export default function OrderTableToolbar({
    filters,
    onFilters,
    //
    canReset,
    onResetFilters
}: Props) {

    const [categories, setCategories] = useState<any>([]);
    const [providers, setProviders] = useState<string[]>([]);
    const [userName, setUserName] = useState<string>('');
    const [startDate, setStartDate] = useState<any>();
    const [endDate, setEndDate] = useState<any>();

    const handleFilterName = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setUserName(event.target.value);
        },
        []
    );

    const handleFilterStartDate = useCallback(
        (newValue: Date | null) => {
            setStartDate(newValue);
        },
        []
    );

    const handleFilterEndDate = useCallback(
        (newValue: Date | null) => {
            setEndDate(newValue);
        },
        []
    );

    const getSelectedProviders = async (selectedCategories: any) => {
        console.log(selectedCategories, '----selectedCategories----');
        const result = await getProviders(selectedCategories);
        console.log(result);
    }

    const getUserCategories = async () => {
        const result = await getCategories();
        if (result.status)
            setCategories(result.data);
    }

    useEffect(() => {
        getUserCategories();
    }, [])

    useEffect(() => {
    }, [endDate, startDate])

    const [personName, setPersonName] = useState<string[]>([]);

    const handleChange = (event: SelectChangeEvent<typeof personName>) => {
        const {
            target: { value }
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value
        );
    };

    useEffect(() => {
        getSelectedProviders(personName);
    }, [personName])

    return (
        <Stack
            spacing={2}
            alignItems={{ xs: 'flex-end', md: 'center' }}
            direction={{
                xs: 'column',
                md: 'row'
            }}
            sx={{
                p: 2.5,
                pr: { xs: 2.5, md: 1 }
            }}
        >
            <DatePicker
                label="Start date"
                value={startDate}
                onChange={(e) => handleFilterStartDate(e)}
                slotProps={{
                    textField: {
                        fullWidth: true
                    }
                }}
                sx={{
                    maxWidth: { md: 200 }
                }}
            />

            <DatePicker
                label="End date"
                value={endDate}
                onChange={(e) => handleFilterEndDate(e)}
                slotProps={{ textField: { fullWidth: true } }}
                sx={{
                    maxWidth: { md: 200 }
                }}
            />

            <FormControl
                sx={{
                    flexShrink: 0,
                    width: { xs: 1, md: 180 }
                }}
            >
                <InputLabel id="category-multiple-checkbox-label">Categories</InputLabel>
                <Select
                    labelId="category-multiple-checkbox-label"
                    id="category-multiple-checkbox"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput label="Categories" />}
                    renderValue={(selected) => selected.join(', ')}
                    sx={{ textTransform: 'capitalize' }}
                >
                    {categories.map((name: any) => (
                        <MenuItem key={name.id} value={name.name}>
                            <Checkbox checked={personName.indexOf(name.name) > -1} />
                            {name.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl
                sx={{
                    flexShrink: 0,
                    width: { xs: 1, md: 180 }
                }}
            >
                <InputLabel id="demo-multiple-checkbox-label">Game Provider</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput label="Game Provider" />}
                    renderValue={(selected) => selected.join(', ')}
                    sx={{ textTransform: 'capitalize' }}
                >
                    {providers.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={personName.indexOf(name) > -1} />
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
                <TextField
                    fullWidth
                    value={filters.name}
                    onChange={handleFilterName}
                    placeholder="Search Id or Username..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                            </InputAdornment>
                        )
                    }}
                />
            </Stack>

            {canReset && (
                <Button
                    color="error"
                    sx={{ flexShrink: 0 }}
                    onClick={onResetFilters}
                    startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                >
                    Clear
                </Button>
            )}
        </Stack>
    );
}
