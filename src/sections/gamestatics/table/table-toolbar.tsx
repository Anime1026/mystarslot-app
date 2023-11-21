import { useCallback, useState } from 'react';
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

const categories = ['Casino', 'Live Casino', 'Sports', 'Live Sports', 'Virtual', 'Racing', 'E-Sports'];
const providers = ['netent', 'novomatic', 'amatic', 'Igt', 'habanero', 'bomba', 'aviatar'];

export default function OrderTableToolbar({
    filters,
    onFilters,
    //
    canReset,
    onResetFilters
}: Props) {
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
                value={filters.startDate}
                onChange={handleFilterStartDate}
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
                value={filters.endDate}
                onChange={handleFilterEndDate}
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
                <InputLabel id="demo-multiple-checkbox-label">Categories</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput label="Categories" />}
                    renderValue={(selected) => selected.join(', ')}
                    sx={{ textTransform: 'capitalize' }}
                >
                    {categories.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={personName.indexOf(name) > -1} />
                            {name}
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
