import { Helmet } from 'react-helmet-async';
// sections
import { Account } from 'src/sections/shop/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Account</title>
      </Helmet>

      <Account />
    </>
  );
}
