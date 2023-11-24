// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import UserNewEditForm from '../create/new-edit-form';

// ----------------------------------------------------------------------

export default function UserCreateView() {
    const settings = useSettingsContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Create a new User"
                links={[
                    {
                        name: 'Dashboard',
                        href: paths.dashboard.root
                    },
                    {
                        name: 'User',
                        href: paths.user.list
                    },
                    { name: 'New User' }
                ]}
                sx={{
                    mb: { xs: 3, md: 5 }
                }}
            />

            <UserNewEditForm />
        </Container>
    );
}
