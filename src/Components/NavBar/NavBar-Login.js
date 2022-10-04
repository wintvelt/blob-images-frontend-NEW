import { Button } from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useUser } from "../UserContext";
// import UserMenu from "./NavBar-UserMenu";

const UserMenu = dynamic(() => import('./NavBar-UserMenu'));


export default function NavBarLogin(props) {
    const { user } = useUser();
    const { isAuthenticated } = user;
    const router = useRouter();
    const login = () => {
        router.push('/login')
    }

    if (isAuthenticated) {
        return <UserMenu />
    }

    if (router.pathname.includes('login')) return <></>;
    return <Button variant="contained" color="secondary" onClick={login}>
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