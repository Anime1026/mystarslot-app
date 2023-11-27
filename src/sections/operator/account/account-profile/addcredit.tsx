import { forwardRef } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Stack, { StackProps } from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

interface Props extends StackProps {
    name?: string;
    quantity: number;
    disabledIncrease?: boolean;
    disabledDecrease?: boolean;
    onIncrease: VoidFunction;
    onDecrease: VoidFunction;
    onChangeCredit: (addcredit: any) => void;
}

const IncrementerButton = forwardRef<HTMLDivElement, Props>(
    ({ quantity, onIncrease, onChangeCredit, onDecrease, disabledIncrease, disabledDecrease, sx, ...other }, ref) => (
        <Stack
            ref={ref}
            flexShrink={0}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
                p: 0.5,
                borderRadius: 1,
                typography: 'background.paper',
                border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.2)}`,
                ...sx
            }}
            {...other}
        >
            <IconButton size="small" onClick={onDecrease} disabled={disabledDecrease} sx={{ borderRadius: 0.75 }}>
                <Iconify icon="eva:minus-fill" width={16} />
            </IconButton>
            <InputBase
                placeholder="Add credit"
                inputProps={{ 'aria-label': 'Add Credit' }}
                value={quantity}
                onChange={(e) => onChangeCredit(e.target.value)}
                type="number"
                sx={{
                    '& input': {
                        textAlign: 'center'
                    },
                    width: 100
                }}
            />

            <IconButton size="small" onClick={onIncrease} disabled={disabledIncrease} sx={{ borderRadius: 0.75 }}>
                <Iconify icon="mingcute:add-line" width={16} />
            </IconButton>
        </Stack>
    )
);

export default IncrementerButton;
