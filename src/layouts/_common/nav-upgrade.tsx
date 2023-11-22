import { useEffect, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
// hooks
import { useAuthContext } from 'src/auth/hooks';
// ----------------------------------------------------------------------

export default function NavUpgrade() {
    const { user } = useAuthContext();
    const [currentdatetime, setTime] = useState<any>();
    setInterval(() => {
        setTime(currentlytime());
    }, 30000);
    const currentlytime = () => {
        const now = new Date();
        const currentDate = now.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const currentTime = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
        const formattedTime = `${currentDate} - ${currentTime} CET`;
        return formattedTime;
    };
    useEffect(() => {
        setTime(currentlytime());
    }, []);

    return (
        <Stack
            sx={{
                px: 2,
                py: 5,
                textAlign: 'center'
            }}
        >
            <Stack alignItems="center">
                <Box sx={{ position: 'relative' }}>
                    <Avatar src={user?.avatar} alt={user?.username} sx={{ width: 48, height: 48 }} />
                </Box>

                <Stack spacing={0.5} sx={{ mt: 1.5, mb: 2 }}>
                    <Typography variant="subtitle2" noWrap>
                        {user?.username}
                    </Typography>

                    <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
                        {user?.email}
                    </Typography>
                </Stack>

                <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
                    {currentdatetime}
                </Typography>
            </Stack>
        </Stack>
    );
}
