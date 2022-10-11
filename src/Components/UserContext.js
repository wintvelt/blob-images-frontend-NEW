import { API, Auth } from 'aws-amplify';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const UserContext = createContext({
    user: undefined,
    setUser: async (user) => null,
    redirectUnAuth: async () => null,
});
const initialUser = { isAuthenticated: false, hasDbData: false };

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
                    photoUrl: userData.photoUrl,
                    photoCount: userData.photoCount,
                    createdAt: userData.createdAt,
                    hasDbData: true
                };
                setUser(newUser);
            } catch (error) {
                console.log(`error getting auth user: "${error}"`)
            }
        }
        const getUserDbData = async () => {
            try {
                const userData = await API.get('blob-images', `/user`);
                const newUser = {
                    ...user,
                    photoUrl: userData.photoUrl,
                    photoCount: userData.photoCount,
                    createdAt: userData.createdAt,
                    hasDbData: true
                };
                setUser(newUser);
            } catch (error) {
                console.log(`error getting auth user: "${error}"`)
            }
        }
        if (!user.isAuthenticated) {
            getAuthUser();
        } else if (!user.hasDbData) {
            getUserDbData();
        };
    }, [])

    // memoized to prevent unnecessary re-renders. NB: Ignore the warning in build on dependencies
    const memoizedContext = useMemo(() => {
        return { user, setUser }
    }, [user.isAuthenticated, user.name, user.email, user.photoUrl, user.photoCount, user.createdAt, user.hasDbData]);

    return (
        <UserContext.Provider value={memoizedContext}>
            {children}
        </UserContext.Provider>
    );
}
export const useUser = () => useContext(UserContext);