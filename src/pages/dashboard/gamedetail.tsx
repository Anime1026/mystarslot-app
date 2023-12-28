import { Helmet } from 'react-helmet-async';
// sections
import GameDetail from 'src/sections/gamedetail';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Game Detail</title>
            </Helmet>

            <GameDetail />
        </>
    );
}
