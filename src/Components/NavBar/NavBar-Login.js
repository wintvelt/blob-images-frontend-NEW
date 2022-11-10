import { Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import userQueryFn, { authQueryFn } from "../../data/user";
import UserMenu from "./NavBar-UserMenu";

export default function NavBarLogin(props) {
    const authData = useQuery(['auth'], authQueryFn);
    const isAuthenticated = !!authData.data;
    const userData = useQuery(['user', isAuthenticated], userQueryFn, { enabled: isAuthenticated });
    const router = useRouter();
    const login = () => {
        router.push('/login')
    }

    if (isAuthenticated) {
        return <UserMenu user={userData.data} />
    }

    if (router.pathname.includes('login')) return <></>;
    return <Button variant="contained" color="secondary" onClick={login} data-cy='nav-login'>
        Log in
    </Button>

    return <>
        {(!isAuthenticated && router.pathname !== '/login') && <Button variant="contained" color="secondary" onClick={login}>
            Log in
        </Button>
        }
        {(!isAuthenticated && router.pathname === '/login') && <></>}
        {(isAuthenticated) &&
            <UserMenu />}
    </>
}