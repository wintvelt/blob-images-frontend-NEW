import { useState } from 'react';
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Avatar } from '@mui/material';
import { useUser } from '../UserContext';
import { Auth } from 'aws-amplify';
import { makeImageUrl } from '../../utils/image-helper';
import { useRouter } from 'next/router';
import { isProtectedRoute } from '../../utils/route-helper';

const avatarStyle = {
    width: '1.5em', height: '1.5em', marginRight: '.5em',
    bgcolor: 'grey'
};
const noTransform = { textTransform: 'none' }

function UserMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const { user, setUser } = useUser();
    const { name } = user;
    const router = useRouter();
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = async () => {
        try {
            await Auth.signOut();
            if (isProtectedRoute(router.pathname)) {
                const msg = encodeURI("Terug naar homepage omdat je bent uitgelogd");
                router.push(`/?toast=${msg}`, '/');
            }
        } catch (error) {
            console.log('error signing out: ', error);
        }
        setUser({ isAuthenticated: false });
    };
    return <>
        <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            color='inherit'
            onClick={handleClick}
            sx={noTransform}
            endIcon={<ExpandMore />}
        >
            <Avatar sx={avatarStyle} alt={name} src={makeImageUrl(user.photoUrl, 40, 40)}>
                {name[0]}
            </Avatar>
            {name}
        </Button>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
    </>
}

UserMenu.whyDidYouRender = true

export default UserMenu