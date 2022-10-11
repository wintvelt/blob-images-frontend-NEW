import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '../../src/ProTip';
import Link from '../../src/Link';
import { getSSRUser, Protected } from '../../src/Components/Protected';
import { getSSRRoute } from '../../src/utils/route-helper';
import { Avatar, Tooltip, IconButton, Tab, Tabs } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useUser } from '../../src/Components/UserContext';
import { makeImageUrl } from '../../src/utils/image-helper';

const boxMargin = { backgroundColor: '#00ccee' }
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

function MyGroupsPage({ path }) {
    const { user } = useUser();
    const activeTab = (path === '/groups') ? 'groups'
        : (path === '/photos') ? 'photos'
            : (path === '/profile') ? 'profile'
                : 'account'
    return (
        <Protected>
            <Box sx={bgImgStyle}>
                <Overlay>
                    <Avatar sx={avatarStyle} src={makeImageUrl(user.photoUrl, 96, 96)} />
                    <div>
                        <Typography variant='h3' component="h2">
                            {user.name}
                            <IconButton variant='outlined' sx={editButtonStyle}><EditIcon /></IconButton>
                        </Typography>
                        <Typography variant='body2'>
                            {(user.createdAt) && `Lid sinds ${user.createdAt}`}
                            {(user.photoCount) && `﹒ ${user.photoCount} foto's`}
                        </Typography>
                    </div>
                </Overlay>
            </Box>
            <Box sx={{ boxShadow: 1 }}>
                <Container maxWidth='sm'>
                    <Tabs value={activeTab}>
                        <Tab label="Mijn groepen" value='groups' />
                        <Tab label="Foto's" value='photos' />
                        <Tooltip title="Naam, profielfoto en achtergrond" arrow>
                            <Tab label="Profiel" value='profile' />
                        </Tooltip>
                        <Tooltip title='Wachtwoord enzo' arrow><Tab label="Account" value='account' /></Tooltip>
                    </Tabs>
                </Container>
            </Box>
            <Container maxWidth="sm" sx={boxMargin}>
                <Box sx={{ my: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        My Groups Page
                    </Typography>
                    <Link href="/">
                        Go to home page
                    </Link>
                    <ProTip />
                </Box>
            </Container>
        </Protected>
    )
}

MyGroupsPage.whyDidYouRender = true

export default MyGroupsPage

export async function getServerSideProps(context) {
    const user = await getSSRUser(context);
    const routeData = getSSRRoute(context)
    return {
        props: {
            user,
            ...routeData
        }
    }
}