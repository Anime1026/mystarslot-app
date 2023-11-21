import { Helmet } from 'react-helmet-async';
// sections
import { List } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> List</title>
            </Helmet>

            <List />
        </>
    );
}
