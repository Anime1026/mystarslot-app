import { useCallback, useState } from 'react';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
// import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
// import FormControl from '@mui/material/FormControl';
// import InputLabel from '@mui/material/InputLabel';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import Checkbox from '@mui/material/Checkbox';

// types
import { IOrderTableFilters, IOrderTableFilterValue } from 'src/types/order';

// apis
// import { getCategories, getProviders } from 'src/api';

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

export default function OrderTableToolbar({
    filters,
    onFilters,
    //
    canReset,
    onResetFilters
}: Props) {
    // const [categories, setCategories] = useState<any>([]);
    // const [providers, setProviders] = useState<any>([]);
    const [startDate] = useState<any>();
    const [endDate] = useState<any>();

    const handleFilterName = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onFilters('name', event.target.value);
        },
        [onFilters]
    );

    const handleFilterStartDate = useCallback(
        (newValue: Date | null) => {
            onFilters('startDate', newValue);
        },
        [onFilters]
    );

    const handleFilterEndDate = useCallback(
        (newValue: Date | null) => {
            onFilters('endDate', newValue);
        },
        [onFilters]
    );

    // const getSelectedProviders = useCallback(
    //     async (selectedCategories: any) => {
    //         setProviderName([]);
    //         const newData = categories
    //             .filter((item: any) => selectedCategories.includes(item.name))
    //             .map((item_: any) => item_._id);

    //         setPersonName(
    //             // On autofill we get a stringified value.
    //             typeof selectedCategories === 'string' ? selectedCategories.split(',') : selectedCategories
    //         );
    //         const providerResult = await getProviders();
    //         const newProvdiers = providerResult.data.filter((item: any) => newData.includes(item.categoryId._id));
    //         // .map((item_: any) => item_._id);

    //         console.log(newProvdiers, '--newProvdiers--');
    //         onFilters(
    //             'categories',
    //             selectedCategories.length > 0 && newProvdiers.length < 1
    //                 ? ['657be873345c1b1234567890']
    //                 : newProvdiers.map((item_: any) => item_._id)
    //         );
    //         setProviders(newProvdiers);
    //     },
    //     [onFilters, categories]
    // );

    // const getUserCategories = async () => {
    //     const result = await getCategories();
    //     if (result.status) setCategories(result.data);
    //     const providerResult = await getProviders();
    //     if (providerResult) setProviders(providerResult.data);
    // };

    // useEffect(() => {
    //     getUserCategories();
    // }, []);

    // const [personName, setPersonName] = useState<string[]>([]);

    // const [providerName, setProviderName] = useState<string[]>([]);

    // const handleProviderChange = (event: SelectChangeEvent<typeof providerName>) => {
    //     const {
    //         target: { value }
    //     } = event;
    //     console.log(value, 'value.value');
    //     if (value.length === 0 && personName.length > 0) {
    //         getSelectedProviders(personName);
    //     } else {
    //         onFilters(
    //             'categories',
    //             providers.filter((item: any) => value.includes(item.name)).map((item_: any) => item_._id)
    //         );
    //     }
    //     setProviderName(typeof value === 'string' ? value.split(',') : value);
    // };

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

            {/* <FormControl
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
                    onChange={(e) => {
                        getSelectedProviders(e.target.value);
                    }}
                    input={<OutlinedInput label="Categories" />}
                    renderValue={(selected) => selected.join(', ')}
                    sx={{ textTransform: 'capitalize' }}
                >
                    {categories.map((name: any) => (
                        <MenuItem key={name._id} value={name.name}>
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
                    value={providerName}
                    onChange={handleProviderChange}
                    input={<OutlinedInput label="Game Provider" />}
                    renderValue={(selected) => selected.join(', ')}
                    sx={{ textTransform: 'capitalize' }}
                >
                    {providers.map((item: any) => (
                        <MenuItem key={item.name} value={item.name}>
                            <Checkbox checked={providerName.indexOf(item.name) > -1} />
                            {item.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl> */}

            <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
                <TextField
                    fullWidth
                    value={filters.name}
                    onChange={handleFilterName}
                    placeholder="Search Username..."
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
