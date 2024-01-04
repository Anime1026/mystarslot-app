import { Helmet } from 'react-helmet-async';
// sections
import { History } from 'src/sections/jackpot/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> History | Jackpot</title>
            </Helmet>

            <History />
        </>
    );
}
