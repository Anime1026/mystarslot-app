import { useState, useCallback } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import AccountProfile from '../account/profile';
import AccountSecurity from '../account/security';
// import AccountCategrories from '../account/categories';
// import AccountProvider from '../account/provider';
// import AccountSocialLinks from '../account-social-links';
// import AccountNotifications from '../account-notifications';
// import AccountChangePassword from '../account-change-password';

// ----------------------------------------------------------------------

const TABS = [
    {
        value: 'profile',
        label: 'Profile',
        icon: <Iconify icon="solar:user-id-bold" width={24} />
    },
    // {
    //     value: 'categories',
    //     label: 'Categories',
    //     icon: <Iconify icon="solar:bill-list-bold" width={24} />
    // },
    // {
    //     value: 'provider',
    //     label: 'Providers',
    //     icon: <Iconify icon="solar:bell-bing-bold" width={24} />
    // },
    // {
    //     value: 'social',
    //     label: 'Social links',
    //     icon: <Iconify icon="solar:share-bold" width={24} />
    // },
    {
        value: 'security',
        label: 'Security',
        icon: <Iconify icon="ic:round-vpn-key" width={24} />
    }
];

// ----------------------------------------------------------------------

export default function AccountView() {
    const settings = useSettingsContext();

    const [currentTab, setCurrentTab] = useState('profile');

    const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    }, []);

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Account"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Operator', href: paths.operator.list },
                    { name: 'Account' }
                ]}
                sx={{
                    mb: { xs: 3, md: 5 }
                }}
            />

            <Tabs
                value={currentTab}
                onChange={handleChangeTab}
                sx={{
                    mb: { xs: 3, md: 5 }
                }}
            >
                {TABS.map((tab) => (
                    <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
                ))}
            </Tabs>

            {currentTab === 'profile' && <AccountProfile />}

            {currentTab === 'security' && <AccountSecurity />}

            {/* {currentTab === 'categories' && <AccountCategrories />} */}

            {/* {currentTab === 'social' && <AccountGeneral />}

      {currentTab === 'security' && <AccountGeneral />} */}
        </Container>
    );
}
