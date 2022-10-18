import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from './Link';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import EditIcon from '@mui/icons-material/Edit';
import { useUser } from './UserContext';
import { makeImageUrl } from '../utils/image-helper';

const bgImgStyle = {
    backgroundImage: "url(https://picsum.photos/2000/500)", /* The image used */
    backgroundColor: '#cccccc', /* Used if the image is unavailable */
    height: '16rem', /* You must set a specified height */
    backgroundPosition: 'center', /* Center the image */
    backgroundRepeat: 'no-repeat', /* Do not repeat the image */
    backgroundSize: 'cover', /* Resize the background image to cover the entire container */
    position: 'relative', // for positioning overlays
}
const overlayStyle = {
    position: 'absolute',
    height: '100%',
    width: '100%',
    background: 'linear-gradient(180deg,transparent 0,rgba(0,0,0,0.5) 50%,rgba(0,0,0,0.7) 80%,rgba(0,0,0,0.8))',
    display: 'flex',
    alignItems: 'flex-end',
    color: 'white'
}
const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: '1.5rem'
}
const avatarStyle = {
    height: '6rem', width: '6rem', marginRight: '1rem'
}
const editButtonStyle = {
    "&:hover": { backgroundColor: 'white', color: t => t.palette.primary.main },
    borderRadius: '50%',
    color: 'inherit',
    border: '1px solid white',
    marginLeft: '1rem'
}

const Overlay = ({ children }) => (
    <Box sx={overlayStyle}>
        <Container maxWidth='sm' sx={containerStyle}>{children}</Container>
    </Box>)

const LinkTab = ({ value, label, title, ...linkProps }) => (
    <Tab
        component={Link}
        value={value}
        label={<Tooltip title={title} arrow><span>{label}</span></Tooltip>}
        {...linkProps}
    />
)

function PersonalHeader({ path }) {
    const { user } = useUser();
    const activeTab = (path === '/groups') ? 'groups'
        : (path === '/photos') ? 'photos'
            : (path === '/profile') ? 'profile'
                : 'account'
    return (
        <>
            <Box sx={bgImgStyle}>
                <Overlay>
                    <Avatar sx={avatarStyle} src={makeImageUrl(user.photoUrl, 96, 96)} />
                    <div>
                        <Typography variant='h3' component="h2">
                            {user.name}
                            <IconButton variant='outlined' sx={editButtonStyle}><EditIcon /></IconButton>
                        </Typography>
                        <Typography variant='body2'>
                            {(user.createdAt) && `Lid sinds ${user.createdAt}﹒`}
                            {`${user.photoCount || 'geen eigen'} foto's`}
                        </Typography>
                    </div>
                </Overlay>
            </Box>
            <Box sx={{ boxShadow: 1 }}>
                <Container maxWidth='sm'>
                    <Tabs value={activeTab}>
                        <LinkTab title="Waar ik lid ben" value='groups' label='Mijn groepen' href='/groups' />
                        <LinkTab title="Mijn eigen foto's" label="Foto's" value='photos' href='/photos' />
                        <LinkTab title="Naam, profielfoto en achtergrond" label="Profiel" value='profile' href='/profile' />
                        <LinkTab title='Wachtwoord enzo' label="Account" value='account' href='/account' />
                    </Tabs>
                </Container>
            </Box>
        </>
    )
}

export default PersonalHeader