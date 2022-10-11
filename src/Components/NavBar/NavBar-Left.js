import ClubLogo from "../../../public/ca_icon_dark_sm.png";
import ClubWord from "../../../public/ca_wordmark_sm.png";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import Link from "../../Link";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import Typography from "@mui/material/Typography";
import { API } from "aws-amplify";
import { useQuery } from '@tanstack/react-query';

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

const BackRoute = ({ groupId, albumId, backRoute }) => {
    const group = useQuery(['groups', groupId], ({ signal }) => {
        const promise = API.get('blob-images', `/groups/${groupId}`);
        signal?.addEventListener('abort', () => {
            API.cancel(promise, "canceled group get");
        });
        return promise;
    }, { enabled: !!groupId });
    const album = useQuery(['albums', albumId], ({ signal }) => {
        const promise = API.get('blob-images', `/groups/${groupId}/albums/${albumId}`);
        signal?.addEventListener('abort', () => {
            API.cancel(promise, "canceled album get");
        });
        return promise;
    }, { enabled: !!albumId });

    // TODO: show the right title depending on type of backroute
    const name = (album.isSuccess && backRoute.split('?')[0].split('/').length === 5) ?
        album.data.name
        : (group.isSuccess && backRoute.split('?')[0].split('/').length === 3) ?
            group.data.name
            : (backRoute === '/groups') ? 'Mijn groepen'
                : (backRoute === '/photos') ? "Mijn foto's"
                    : "Terug"

    return <Link href={backRoute} color="inherit" sx={backrouteStyle}>
        <KeyboardArrowLeft />
        <Typography>
            {name}
        </Typography>
    </Link>
}

export default function NavBarLeft(props) {
    const isChild = (props.backRoute && props.backRoute !== '/');
    return <>
        {!isChild && <HomeIcon />}
        {isChild && <BackRoute {...props} />}
    </>
}