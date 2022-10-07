import { API, Auth } from 'aws-amplify';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const UserContext = createContext({
    user: undefined,
    setUser: async (user) => null,
    redirectUnAuth: async () => null,
});
const initialUser = { isAuthenticated: false };

export function UserProvider({ ssrUser, children }) {
    const [user, setUser] = useState(ssrUser || initialUser);

    useEffect(() => {
        const getAuthUser = async () => {
            try {
                const authResult = await Auth.currentAuthenticatedUser();
                const userData = await API.get('blob-images', `/user`);
                const newUser = {
                    isAuthenticated: true,
                    name: authResult.attributes["custom:name"],
                    email: authResult.attributes.email,
                    photoUrl: userData.photoUrl
                };
                setUser(newUser);
            } catch (error) {
                console.log(`error getting auth user: "${error}"`)
            }
        }
        if (!user.isAuthenticated) getAuthUser();
    }, [])

    // memoized to prevent unnecessary re-renders. NB: Ignore the warning in build on dependencies
    const memoizedContext = useMemo(() => {
        return { user, setUser }
    }, [user.isAuthenticated, user.name, user.email, user.photoUrl]);

    return (
        <UserContext.Provider value={memoizedContext}>
            {children}
        </UserContext.Provider>
    );
}
export const useUser = () => useContext(UserContext);