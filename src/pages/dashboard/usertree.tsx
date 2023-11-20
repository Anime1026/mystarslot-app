import { Helmet } from 'react-helmet-async';
// sections
import UserTreeView from 'src/sections/usertree/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User Tree</title>
      </Helmet>

      <UserTreeView />
    </>
  );
}
