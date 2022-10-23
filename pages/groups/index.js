import * as React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Sort from '@mui/icons-material/Sort';
import Add from '@mui/icons-material/Add';
import { getSSRUser, Protected } from '../../src/Components/Protected';
import { getSSRRoute } from '../../src/utils/route-helper';
import PersonalHeader from '../../src/Components/PersonalHeader';
import GroupCard from '../../src/Components/GroupCard';
import { API } from 'aws-amplify';
import { useQuery } from '@tanstack/react-query';
import { Typography } from '@mui/material';

const barStyle = {
    my: 4,
    // backgroundColor: '#eeeeee',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end'
};
const loadingStyle = {
    p: 4,
    color: '#aaaaaa'
}

const noTransform = { textTransform: 'none' }

function MyGroupsPage({ path }) {
    const groups = useQuery(['groups'], ({ signal }) => {
        const promise = API.get('blob-images', `/groups`);
        signal?.addEventListener('abort', () => {
            API.cancel(promise, "canceled groups get");
        });
        return promise;
    });

    const open = false;
    const handleClickSort = () => alert('clicked')
    const handleClickNew = () => alert('clicked')

    return (
        <Protected>
            <PersonalHeader path={path} />

            {groups.isLoading && <Container maxWidth='lg'>
                <Typography variant='h3' component='h1' align='center' sx={loadingStyle}>
                    <CircularProgress color='inherit' />{' '}Laden...
                </Typography>
            </Container>}
            {groups.isSuccess && <Container maxWidth='lg'>
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
                        sx={noTransform}
                        startIcon={<Add />}>
                        Nieuwe groep
                    </Button>
                </Box>
                <Grid container spacing={2}>
                    {groups.data.map(group => (
                        <Grid item key={group.SK}>
                            <GroupCard groupId={group.SK} name={group.name} since={group.createdAt}
                                photoUrl={group.photo.url} newPicsCount={groups.newPicsCount} />
                        </Grid>
                    ))}
                </Grid>
                <pre>{JSON.stringify(groups.data, null, 2)}</pre>
            </Container>}
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