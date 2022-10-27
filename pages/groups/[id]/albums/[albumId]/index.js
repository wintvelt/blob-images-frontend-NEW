import * as React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Sort from '@mui/icons-material/Sort';
import Add from '@mui/icons-material/Add';
import Filter from '@mui/icons-material/FilterAlt';
import { getSSRUser, Protected } from '../../../../../src/Components/Protected';
import { getSSRRoute } from '../../../../../src/utils/route-helper';
import AlbumHeader from '../../../../../src/Components/AlbumHeader';
import LoadingBlock from '../../../../../src/Components/LoadingBlock';
import { API } from 'aws-amplify';
import { useQuery } from '@tanstack/react-query';
import AlbumCard from '../../../../../src/Components/AlbumCard';
import { ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import Image from 'next/image';
import { makeImageUrl } from '../../../../../src/utils/image-helper';


const barStyle = {
    my: 1,
    // backgroundColor: '#eeeeee',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-start'
};

const noTransform = { textTransform: 'none' }
const fixWidth = { ...noTransform, width: '10em' }
const filler = { flex: 1 }

export default function AlbumPage({ path, groupId, albumId }) {
    const albumPhotos = useQuery(['albumPhotos', groupId, albumId], ({ signal }) => {
        const promise = API.get('blob-images', `/groups/${groupId}/albums/${albumId}/photos`);
        signal?.addEventListener('abort', () => {
            API.cancel(promise, "canceled albumPhotos get");
        });
        return promise;
    });

    const open = false;
    const handleClickSort = () => alert('clicked')
    const handleClickNew = () => alert('clicked')

    const photos = (albumPhotos.data) ? albumPhotos.data : null

    return (
        <Protected>
            <Container maxWidth='lg'>
                <AlbumHeader path={path} groupId={groupId} albumId={albumId} />
            </Container>
            {albumPhotos.isLoading && <LoadingBlock />}
            {albumPhotos.isSuccess && <Container maxWidth='lg'>
                <Box sx={barStyle}>
                    <Button
                        variant='outlined'
                        color='primary'
                        id="sort-button"
                        data-cy="sort-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClickSort}
                        sx={fixWidth}
                        startIcon={<Sort />}
                    // endIcon={<ExpandMore />}
                    >
                        datum ↑
                    </Button>
                    <Button
                        variant='outlined'
                        color='primary'
                        id="sort-button"
                        data-cy="sort-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClickSort}
                        sx={fixWidth}
                        startIcon={<Filter />}
                    // endIcon={<ExpandMore />}
                    >
                        (geen)
                    </Button>
                    <div style={filler} />
                    <Button
                        variant='outlined'
                        color='primary'
                        onClick={handleClickNew}
                        sx={noTransform}
                        startIcon={<Add />}>
                        Foto's toevoegen
                    </Button>
                </Box>
                <ImageList variant='standard' cols={3} gap={8}>
                    {photos.map((photo, i) => {
                        return <ImageListItem key={photo.SK} sx={{ overflow: 'hidden' }}>
                            <img src={makeImageUrl(photo.photo.url, 300)} />
                            <ImageListItemBar position='bottom' title={i} sx={{ 
                                transform: `translateY(100%)`,
                                '&:hover' : { transform: 'translatey(0)'} 
                                }} />
                        </ImageListItem>
                    })}

                </ImageList>
                <Grid container spacing={4}>
                    {photos.map(photo => (
                        <Grid item xs={12} md={3} key={photo.SK}>
                            <pre>{JSON.stringify(photo, null, 2)}</pre>
                            {/* <AlbumCard groupId={album.PK?.slice(2)} albumId={album.SK}
                                name={album.name} since={album.createdAt}
                                photoUrl={album.photo?.url} newPicsCount={album.newPicsCount}
                                photoCount={album.photoCount} /> */}
                        </Grid>
                    ))}
                </Grid>
            </Container>}
        </Protected>
    )
}

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