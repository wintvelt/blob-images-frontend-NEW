import ClubLogo from "../../../public/ca_icon_dark_sm.png";
import ClubWord from "../../../public/ca_wordmark_sm.png";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import { useRouter } from "next/router";
import { isChildRoute, previousRoute } from "../../utils/route-helper";
import Link from "../../Link";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import Typography from "@mui/material/Typography";

const HomeIcon = () => <>
    <Link href="/">
        <IconButton>
            <Image src={ClubLogo} alt="logo clubalmanac" />
        </IconButton>
    </Link>
    <Link href="/">
        <IconButton sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Image src={ClubWord} alt="word mark clubalmanac" />
        </IconButton>
    </Link>
</>

const backrouteStyle = { display: 'flex', textDecoration: 'none' };

const BackRoute = ({ pathname }) => {
    const prevRoute = previousRoute(pathname);
    // TODO: get route name from database via API

    return <Link href={prevRoute} color="inherit" sx={backrouteStyle}>
        <KeyboardArrowLeft />
        <Typography>
            {prevRoute}
        </Typography>
    </Link>
}

export default function NavBarLeft(props) {
    const router = useRouter();
    const isChild = isChildRoute(router.pathname);
    return <>
        {!isChild && <HomeIcon />}
        {isChild && <BackRoute pathname={router.pathname} />}
    </>
}