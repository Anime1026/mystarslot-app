import { Helmet } from 'react-helmet-async';
// sections
import { Providers } from 'src/sections/game-management/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Providers</title>
      </Helmet>

      <Providers />
    </>
  );
}
