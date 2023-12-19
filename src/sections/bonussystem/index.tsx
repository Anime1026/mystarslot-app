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
import DepositBonus from './orther/depositbonus';
// import AccountSessions from './account/sessions';
// import AccountSecurity from './account/change-password';

// ----------------------------------------------------------------------

const TABS = [
    {
        value: 'DepositBonus',
        label: 'Deposit Bonus',
        icon: <Iconify icon="solar:user-id-bold" width={24} />
    }
    // {
    //     value: 'activesession',
    //     label: 'Active Session',
    //     icon: <Iconify icon="solar:bill-list-bold" width={24} />
    // },

    // {
    //     value: 'security',
    //     label: 'Security',
    //     icon: <Iconify icon="ic:round-vpn-key" width={24} />
    // }
];

// ----------------------------------------------------------------------

export default function DepositView() {
    const settings = useSettingsContext();

    const [currentTab, setCurrentTab] = useState('DepositBonus');

    const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    }, []);

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Account"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'User', href: paths.user.list },
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

            {currentTab === 'DepositBonus' && <DepositBonus />}

            {/* {currentTab === 'activesession' && <AccountSessions />} */}

            {/* {currentTab === 'security' && <AccountSecurity />} */}
        </Container>
    );
}
