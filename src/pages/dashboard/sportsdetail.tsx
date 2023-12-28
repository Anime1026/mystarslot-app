import { Helmet } from 'react-helmet-async';
// sections
import SportsDetail from 'src/sections/sportsdetail';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Sports Detail</title>
            </Helmet>

            <SportsDetail />
        </>
    );
}
