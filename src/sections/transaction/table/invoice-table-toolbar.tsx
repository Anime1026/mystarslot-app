import { useCallback } from 'react';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
// types
import { IInvoiceTableFilters, IInvoiceTableFilterValue } from 'src/types/invoice';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
    filters: IInvoiceTableFilters;
    onFilters: (name: string, value: IInvoiceTableFilterValue) => void;
    //
    dateError: boolean;
    serviceOptions: string[];
};

export default function InvoiceTableToolbar({
    filters,
    onFilters,
    //
    dateError,
    serviceOptions
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
            {/* <FormControl
                    sx={{
                        flexShrink: 0,
                        width: { xs: 1, md: 180 }
                    }}
                >
                    <InputLabel>From</InputLabel>

                    <Select
                        multiple
                        value={filters.service}
                        onChange={handleFilterService}
                        input={<OutlinedInput label="Service" />}
                        renderValue={(selected) => selected.map((value) => value).join(', ')}
                        sx={{ textTransform: 'capitalize' }}
                    >
                        {serviceOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                <Checkbox disableRipple size="small" checked={filters.service.includes(option)} />
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl> */}

            <DatePicker
                label="Start date"
                value={filters.startDate}
                onChange={handleFilterStartDate}
                slotProps={{ textField: { fullWidth: true } }}
                sx={{
                    maxWidth: { md: 180 }
                }}
            />

            <DatePicker
                label="End date"
                value={filters.endDate}
                onChange={handleFilterEndDate}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        error: dateError
                    }
                }}
                sx={{
                    maxWidth: { md: 180 }
                }}
            />

            <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
                <TextField
                    fullWidth
                    value={filters.name}
                    onChange={handleFilterName}
                    placeholder="Search customer or invoice number..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                            </InputAdornment>
                        )
                    }}
                />
            </Stack>
        </Stack>
    );
}
