import * as React from 'react';
import { useUser } from './UserContext';
import { withSSRContext } from 'aws-amplify';
import { useRouter } from 'next/router';
import LoadingMain from './LoadingMain';

const detour = '/login'

export function Protected({ children }) {
    const { user } = useUser();
    const router = useRouter();

    const redirectUnAuth = () => {
        if (!user.isAuthenticated) {
            const message = encodeURI("Log in om ledenpagina's te bezoeken");
            const redirectTo = encodeURI(router.pathname)
            router.replace(
                `${detour}?toast=${message}&redirectTo=${redirectTo}`,
                `${detour}`,
            );
        }
    };

    React.useEffect(() => {
        redirectUnAuth()
    }, []);

    return (user.isAuthenticated) ?
        <>{ children }</>
        : <LoadingMain />
}

export async function getSSRUser(context) {
    const { Auth, API } = withSSRContext(context)
    try {
        const authResult = await Auth.currentAuthenticatedUser();
        const userData = await API.get('blob-images', `/user`);
        const user = {
            isAuthenticated: true,
            name: authResult.attributes["custom:name"],
            email: authResult.attributes.email,
            photoUrl: userData.photoUrl
        };
        return user
    } catch (err) {
        return { isAuthenticated: false }
    }
}