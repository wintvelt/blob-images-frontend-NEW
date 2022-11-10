import { useState } from 'react';
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Avatar } from '@mui/material';
import { Auth } from 'aws-amplify';
import { makeImageUrl } from '../../utils/image-helper';
import { useRouter } from 'next/router';
import { isProtectedRoute } from '../../utils/route-helper';
import { useQueryClient } from '@tanstack/react-query';

const avatarStyle = {
    width: '1.5em', height: '1.5em', marginRight: '.5em',
    bgcolor: 'grey'
};
const noTransform = { textTransform: 'none' }

function UserMenu({ user }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const queryClient = useQueryClient();
    const name = user?.name || '';
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
            queryClient.setQueryData(['auth'], false)
            queryClient.removeQueries({ queryKey: ['user'] });
            if (isProtectedRoute(router.pathname)) {
                const msg = encodeURI("Terug naar homepage omdat je bent uitgelogd");
                router.push(`/?toast=${msg}`, '/');
            }
            if (router.pathname.indexOf('/invites/') === 0) {
                // if we are on invite page, force rerender
                await queryClient.invalidateQueries({ queryKey: ['invite'] })
            }
        } catch (error) {
            console.log('error signing out: ', error);
        }
    };

    return <>
        <Button
            id="usermenu-button"
            data-cy="usermenu-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            color='inherit'
            onClick={handleClick}
            sx={noTransform}
            endIcon={<ExpandMore />}
        >
            <Avatar sx={avatarStyle} alt={name} src={makeImageUrl(user?.photoUrl, 40, 40)}>
                {name[0]}
            </Avatar>
            {name}
        </Button>
        <Menu
            id="usermenu-menu"
            data-cy="usermenu-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleLogout} data-cy='usermenu-logout'>Logout</MenuItem>
        </Menu>
    </>
}

export default UserMenu