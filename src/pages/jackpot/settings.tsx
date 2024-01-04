import { Helmet } from 'react-helmet-async';
// sections
import { Settings } from 'src/sections/jackpot/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> History | Jackpot</title>
            </Helmet>

            <Settings />
        </>
    );
}
