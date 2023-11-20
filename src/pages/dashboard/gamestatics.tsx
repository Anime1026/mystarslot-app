import { Helmet } from 'react-helmet-async';
// sections
import GameStatics from 'src/sections/gamestatics';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Game Statics</title>
      </Helmet>

      <GameStatics />
    </>
  );
}
