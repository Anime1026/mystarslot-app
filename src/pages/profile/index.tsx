import { Helmet } from 'react-helmet-async';
// sections
import Profile from 'src/sections/profile';

// ----------------------------------------------------------------------

export default function LoginPage() {
    return (
        <>
            <Helmet>
                <title> Jwt: Login</title>
            </Helmet>

            <Profile />
        </>
    );
}
