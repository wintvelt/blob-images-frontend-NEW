import * as React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Sort from '@mui/icons-material/Sort';
import Add from '@mui/icons-material/Add';
import { getSSRUser, Protected } from '../../src/Components/Protected';
import { getSSRRoute } from '../../src/utils/route-helper';
import PersonalHeader from '../../src/Components/PersonalHeader';
import GroupCard from '../../src/Components/GroupCard';
import LoadingBlock from '../../src/Components/LoadingBlock';
import { API } from 'aws-amplify';
import { useQuery } from '@tanstack/react-query';

const barStyle = {
    my: 4,
    // backgroundColor: '#eeeeee',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'space-between'
};

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
            {groups.isLoading && <LoadingBlock />}
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
                    <div></div>
                    <Button
                        variant='outlined'
                        color='primary'
                        onClick={handleClickNew}
                        sx={noTransform}
                        startIcon={<Add />}>
                        Nieuwe groep
                    </Button>
                </Box>
                <Grid container spacing={2}>
                    {groups.data.map(group => (
                        <Grid item xs={12} md={4} lg={3} key={group.SK}>
                            <GroupCard groupId={group.SK} name={group.name} since={group.createdAt}
                                photoUrl={group.photo.url} newPicsCount={group.newPicsCount}
                                memberCount={group.memberCount} photoCount={group.photoCount} />
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