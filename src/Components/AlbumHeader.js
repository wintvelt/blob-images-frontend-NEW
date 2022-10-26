import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from './Link';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import EditIcon from '@mui/icons-material/Edit';
import { makeImageUrl } from '../utils/image-helper';
import { useQuery } from '@tanstack/react-query';
import { API } from 'aws-amplify';

const bgImgStyle = {
    backgroundColor: '#cccccc', /* Used if the image is unavailable */
    height: '16rem', /* You must set a specified height */
    backgroundPosition: '0% 70%', /* position almost at bottom */
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
    color: 'white'
}
const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    paddingBottom: '1.5rem'
}
const editButtonStyle = {
    "&:hover": { backgroundColor: 'white', color: t => t.palette.primary.main },
    borderRadius: '50%',
    color: 'inherit',
    border: '1px solid white',
    marginLeft: '1rem'
}

const tabBarStyle = {
    backgroundColor: '#ffffff',
    boxShadow: 1
}

const Overlay = ({ children }) => (
    <Box sx={overlayStyle}>
        <Container maxWidth='lg' sx={containerStyle}>{children}</Container>
    </Box>)

const LinkTab = ({ value, label, title, ...linkProps }) => (
    <Tab
        component={Link}
        value={value}
        label={(title) ?
            <Tooltip title={title} arrow><span>{label}</span></Tooltip>
            : <span>{label}</span>}
        {...linkProps}
    />
)

function AlbumHeader({ groupId, albumId }) {
    const album = useQuery(['album', groupId, albumId], ({ signal }) => {
        const promise = API.get('blob-images', `/groups/${groupId}/albums/${albumId}`);
        signal?.addEventListener('abort', () => {
            API.cancel(promise, "canceled album get");
        });
        return promise;
    });
    const { name, description, createdAt, photoCount } = album.data || {}

    const photoUrl = album.data?.photo?.url;
    const memoedOverlayStyle = React.useMemo(() => ({
        ...bgImgStyle,
        backgroundImage: (photoUrl) ?
            `url(${makeImageUrl(photoUrl, 1800)})`
            : "url(https://picsum.photos/2000/500)",
    }), [album.data?.photo?.url])

    return (
        <>
            <Box sx={memoedOverlayStyle}>
                <Overlay>
                    <Typography variant='h2' component="h1" gutterBottom>
                        {name}
                        {(name) && <IconButton variant='outlined' sx={editButtonStyle}><EditIcon /></IconButton>}
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        {description}
                    </Typography>
                    <Typography variant='body2'>
                        {(createdAt) && `Vanaf ${createdAt.slice(0, 4)}`}
                        {(photoCount !== undefined) && ` · ${photoCount || 'geen'} foto${(albumCount !== 1) && '\'s'}`}
                    </Typography>
                </Overlay>
            </Box>
        </>
    )
}

export default AlbumHeader