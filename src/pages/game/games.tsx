import { Helmet } from 'react-helmet-async';
// sections
import { Games } from 'src/sections/game-management/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> Games</title>
            </Helmet>

            <Games />
        </>
    );
}
