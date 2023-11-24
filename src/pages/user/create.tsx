import { Helmet } from 'react-helmet-async';
// sections
import { Create } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> create</title>
            </Helmet>

            <Create />
        </>
    );
}
