import { Auth } from 'aws-amplify';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const UserContext = createContext({
    user: undefined,
    setUser: async (user) => null,
    redirectUnAuth: async () => null,
});
const initialUser = { isAuthenticated: false };

const getAuthUser = async () => {
    let authResult;
    try {
        authResult = await Auth.currentAuthenticatedUser;
        console.log(authResult);
    } catch (error) {
        console.log(error)
    }
    return [authResult, error];
}

export function UserProvider({ children }) {
    const [user, setUser] = useState(initialUser);
    const router = useRouter();
    const redirectUnAuth = (pathname = '/login') => {
        if (!user.isAuthenticated) {
            router.replace(
                `${pathname}?toast=${encodeURI("Log in om ledenpagina's te bezoeken")}`,
                `${pathname}`,
            );
        }
    };
    useEffect(() => {
        const getAuthUser = async () => {
            let authResult;
            try {
                authResult = await Auth.currentAuthenticatedUser();
                setUser({
                    isAuthenticated: true,
                    name: authResult.attributes["custom:name"],
                    email: authResult.attributes.email
                })
                // TODO: get user details (avatar) from DB
            } catch (error) {
                console.log(error)
            }
            console.log(authResult);
        }
        getAuthUser();
    }, [])
    // memoize context values to prevent unnecessary re-renders caused by redirectUnAuth
    const memoizedContext = useMemo(() => {
        return { user, setUser, redirectUnAuth }
    }, [user]);

    return (
        <UserContext.Provider value={memoizedContext}>
            {children}
        </UserContext.Provider>
    );
}
export const useUser = () => useContext(UserContext);