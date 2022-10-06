import { useState } from 'react';
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Avatar } from '@mui/material';
import { useUser } from '../UserContext';
import { Auth } from 'aws-amplify';

const avatarStyle = {
    width: '1.5em', height: '1.5em', marginRight: '.5em',
    bgcolor: 'secondary'
};
const noTransform = { textTransform: 'none' }

function UserMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const { user, setUser } = useUser();
    const { name } = user;
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
            <Avatar sx={avatarStyle} alt={name}>
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