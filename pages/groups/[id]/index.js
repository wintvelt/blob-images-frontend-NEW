import * as React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Sort from '@mui/icons-material/Sort';
import Add from '@mui/icons-material/Add';
import { getSSRRoute } from '../../../src/utils/route-helper';
import GroupHeader from '../../../src/Components/GroupHeader';
import LoadingBlock from '../../../src/Components/LoadingBlock';
import { API } from 'aws-amplify';
import { useQuery } from '@tanstack/react-query';
import AlbumCard from '../../../src/Components/AlbumCard';
import { isAuthUser } from '../../../src/Components/Protected';

const barStyle = {
    my: 4,
    // backgroundColor: '#eeeeee',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'space-between'
};

const noTransform = { textTransform: 'none' }

export default function GroupPage({ path, groupId }) {
    const albums = useQuery(['albums', groupId], ({ signal }) => {
        const promise = API.get('blob-images', `/groups/${groupId}/albums`);
        signal?.addEventListener('abort', () => {
            API.cancel(promise, "canceled albums get");
        });
        return promise;
    });

    const open = false;
    const handleClickSort = () => alert('clicked')
    const handleClickNew = () => alert('clicked')

    const albumsData = (albums.data) ? albums.data : null

    return (
        <>
            <GroupHeader path={path} groupId={groupId} />
            {albums.isLoading && <LoadingBlock />}
            {albums.isSuccess && <Container maxWidth='lg'>
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
                        sx={noTransform}
                        startIcon={<Sort />}
                    // endIcon={<ExpandMore />}
                    >
                        datum ↑
                    </Button>
                    <Button
                        variant='outlined'
                        color='primary'
                        onClick={handleClickNew}
                        sx={noTransform}
                        startIcon={<Add />}>
                        Nieuw Album
                    </Button>
                </Box>
                <Grid container spacing={4}>
                    {albumsData.map(album => (
                        <Grid item xs={12} md={4} lg={4} key={album.SK}>
                            <AlbumCard groupId={album.PK?.slice(2)} albumId={album.SK}
                                name={album.name} since={album.createdAt}
                                photoUrl={album.photo?.url} newPicsCount={album.newPicsCount}
                                photoCount={album.photoCount} />
                        </Grid>
                    ))}
                </Grid>
                <pre>{JSON.stringify(albums.data, null, 2)}</pre>
            </Container>}
        </>
    )
}

export async function getServerSideProps(context) {
    const routeData = getSSRRoute(context)
    const isAuthenticated = await isAuthUser(context)
    return (isAuthenticated) ?
        {
            props: {
                ...routeData
            }
        }
        : { redirect: { destination: '/login' } }
}