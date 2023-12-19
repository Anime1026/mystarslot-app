import { Helmet } from 'react-helmet-async';
// sections
import BonusSystem from 'src/sections/bonussystem';

// ----------------------------------------------------------------------

export default function LoginPage() {
    return (
        <>
            <Helmet>
                <title> Bonus System</title>
            </Helmet>

            <BonusSystem />
        </>
    );
}
