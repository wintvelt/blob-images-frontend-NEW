import ClubLogo from "../../../public/ca_icon_dark_sm.png";
import ClubWord from "../../../public/ca_wordmark_sm.png";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import Link from "next/link";

export default function NavBarLeft(props) {
    return <>
        <Link href="/" passHref>
            <IconButton>
                <Image src={ClubLogo} alt="logo clubalmanac" />
            </IconButton>
        </Link>
        <Link href="/" passHref>
            <IconButton sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Image src={ClubWord} alt="word mark clubalmanac" />
            </IconButton>
        </Link>
    </>
}