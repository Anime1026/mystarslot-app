import { Helmet } from 'react-helmet-async';
// sections
import { Categories } from 'src/sections/game-management/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> Category</title>
            </Helmet>

            <Categories />
        </>
    );
}
