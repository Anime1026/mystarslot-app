import { Helmet } from 'react-helmet-async';
// sections
import SportsStatics from 'src/sections/sportsstatics';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> Dashboard: SportsBook Statics</title>
            </Helmet>

            <SportsStatics />
        </>
    );
}
