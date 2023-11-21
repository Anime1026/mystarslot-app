import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { IUserItem } from 'src/types/user';

// ----------------------------------------------------------------------

export function useRouter() {
    const navigate = useNavigate();

    const router = useMemo(
        () => ({
            back: () => navigate(-1),
            forward: () => navigate(1),
            reload: () => window.location.reload(),
            push: (href: string, data?: IUserItem) => navigate(href, { state: data }),
            replace: (href: string) => navigate(href, { replace: true })
        }),
        [navigate]
    );

    return router;
}
