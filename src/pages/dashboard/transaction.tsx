import { Helmet } from 'react-helmet-async';
// sections
import Transaction from 'src/sections/transaction';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Transaction</title>
            </Helmet>

            <Transaction />
        </>
    );
}
