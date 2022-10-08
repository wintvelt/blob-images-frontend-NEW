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
import Link from '../../Link';

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
const middlePos = { position: 'absolute', left: 'calc(50% - 16px)', top: 'calc(50% - 16px)' }

function NavBar(props) {
    const isChildPath = (props.backRoute !== '/')
    return (
        <HideOnScroll {...props}>
            <AppBar>
                <Toolbar>
                    <NavBarLeft {...props} />
                    <Typography variant="h6" component="div" sx={flexGrow} />
                    <NavBarLogin />
                    {(isChildPath) && <Link sx={middlePos} href='/'>
                        <Image src={ClubLogo} alt='logo clubalmanac' />
                    </Link>}
                </Toolbar>
            </AppBar>
        </HideOnScroll>
    );
}

NavBar.whyDidYouRender = true

export default NavBar
