import { Helmet } from 'react-helmet-async';
// sections
import { List } from 'src/sections/operator/view';

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
