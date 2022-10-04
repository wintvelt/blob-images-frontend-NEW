import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
import NavBarLeft from './NavBar-Left';
import NavBarLogin from './NavBar-Login';
import Image from 'next/image';
import ClubLogo from "../../../public/ca_icon_dark_sm.png";
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/router';
import { isChildRoute } from '../../utils/route-helper';

function HideOnScroll(props) {
    const { children } = props;
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
};

const flexGrow = { flexGrow: 1 }
const middlePos = { position: 'absolute', left: 'calc(50% - 16px)' }

function NavBar(props) {
    const router = useRouter()
    const isChildPath = isChildRoute(router.pathname)
    return (
        <HideOnScroll {...props}>
            <AppBar>
                <Toolbar>
                    <NavBarLeft />
                    <Typography variant="h6" component="div" sx={flexGrow} />
                    <NavBarLogin />
                    {(isChildPath) && <IconButton sx={middlePos}>
                        <Image src={ClubLogo} alt='logo clubalmanac' />
                    </IconButton>}
                </Toolbar>
            </AppBar>
        </HideOnScroll>
    );
}

NavBar.whyDidYouRender = true

export default NavBar
