import { Helmet } from 'react-helmet-async';
// sections
import Commissionstats from 'src/sections/commissionstats';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Commission Stats</title>
      </Helmet>

      <Commissionstats />
    </>
  );
}
