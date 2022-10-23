import { API, Auth } from 'aws-amplify';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const UserContext = createContext({
    user: undefined,
    setUser: (user) => null
});
const initialUser = { isAuthenticated: false, hasDbData: false };

const addDbUser = (user, userData) => {
    return {
        ...user,
        photoUrl: userData.photoUrl,
        photoCount: userData.photoCount,
        createdAt: userData.createdAt,
        hasDbData: true
    }
}

export function makeUser(authResult, userData) {
    return addDbUser({
        isAuthenticated: true,
        name: authResult.attributes["custom:name"],
        email: authResult.attributes.email,
    }, userData);
}

export function UserProvider({ ssrUser, children }) {
    const [user, setUser] = useState(ssrUser || initialUser);

    useEffect(() => {
        const getAuthUser = async () => {
            try {
                const authResult = await Auth.currentAuthenticatedUser();
                const userData = await API.get('blob-images', `/user`);
                const newUser = makeUser(authResult, userData);
                setUser(newUser);
            } catch (error) {
                if (error !== 'The user is not authenticated') {
                    console.log(`error getting auth user: "${error}"`)
                }
            }
        }
        const getUserDbData = async () => {
            try {
                const userData = await API.get('blob-images', `/user`);
                const newUser = addDbUser(user, userData);
                setUser(newUser);
            } catch (error) {
                console.log(`error getting db user: "${error}"`)
            }
        }
        if (!user.isAuthenticated) {
            // console.log('getting user auth data')
            getAuthUser();
        } else if (!user.hasDbData) {
            // console.log('getting user db data')
            getUserDbData();
        };
    }, [])

    // memoized to prevent unnecessary re-renders. NB: Ignore the warning on dependencies in build
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