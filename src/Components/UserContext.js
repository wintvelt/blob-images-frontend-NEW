import { useRouter } from 'next/router';
import { createContext, useContext, useMemo, useState } from 'react';

const UserContext = createContext({
    user: undefined,
    setUser: async (user) => null,
    redirectUnAuth: async () => null,
});
const initialUser = { isAuthenticated: false };

export function UserProvider({ children }) {
    const [user, setUser] = useState(initialUser);
    const router = useRouter();
    const redirectUnAuth = (pathname = '/login') => {
        if (!user.isAuthenticated) {
            router.push(`${pathname}?toast=${encodeURI("Log in om ledenpagina's te bezoeken")}`)
        }
    }
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