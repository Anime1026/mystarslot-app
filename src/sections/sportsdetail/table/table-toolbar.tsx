import { useCallback, useState } from 'react';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

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

export default function OrderTableToolbar({
    filters,
    onFilters,
    //
    canReset,
    onResetFilters
}: Props) {
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

            <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
                <TextField
                    fullWidth
                    value={filters.name}
                    onChange={handleFilterName}
                    placeholder="Search Game Type..."
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
