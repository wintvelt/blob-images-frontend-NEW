import * as React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GroupAdd from '@mui/icons-material/GroupAdd';
import { getSSRUser, Protected } from '../../../../src/Components/Protected';
import { getSSRRoute } from '../../../../src/utils/route-helper';
import GroupHeader from '../../../../src/Components/GroupHeader';
import LoadingBlock from '../../../../src/Components/LoadingBlock';
import { API } from 'aws-amplify';
import { useQuery } from '@tanstack/react-query';
import MemberCard from '../../../../src/Components/MemberCard';
import Link from '../../../../src/Components/Link';


const barStyle = {
    py: 2,
    // backgroundColor: '#eeeeee',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end'
};

const noTransform = { textTransform: 'none' }
const subHeaderStyle = { pt: 1, mb: -1 }

// helpers for sorting members and creating subheaders
const membersCat = (mem) => {
    if (mem.status === 'invite') return 'invite'
    if (mem.userRole === 'admin') return 'admin'
    return 'guest'
}
const memberSort = (a, b) => (
    (a.status === 'invite') ?
        (b.status === 'invite') ?
            (a.name.toLowerCase() < b.name.toLowerCase()) ? -1
                : (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : 0
            : 1
        : (b.status === 'invite') ?
            -1
            : (a.userRole === 'admin') ?
                (b.userRole === 'admin') ?
                    (a.name.toLowerCase() < b.name.toLowerCase()) ? -1
                        : (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : 0
                    : -1
                : (b.userRole === 'admin') ?
                    1
                    : (a.name.toLowerCase() < b.name.toLowerCase()) ? -1
                        : (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : 0

)

const MembersMain = ({ path, groupId }) => {
    const members = useQuery(['members', groupId], ({ signal }) => {
        const promise = API.get('blob-images', `/groups/${groupId}/members`);
        signal?.addEventListener('abort', () => {
            API.cancel(promise, "canceled members get");
        });
        return promise;
    });

    // get group to check if invite is still possible
    const group = useQuery(['group', groupId], ({ signal }) => {
        const promise = API.get('blob-images', `/groups/${groupId}`);
        signal?.addEventListener('abort', () => {
            API.cancel(promise, "canceled group get");
        });
        return promise;
    });

    const membersData = React.useMemo(() => {
        if (!members.data) return null;
        let enhancedMembersData = [];
        let currentCat = undefined;
        members.data.sort(memberSort).forEach(mem => {
            const memCat = membersCat(mem);
            if (memCat !== currentCat) {
                enhancedMembersData.push({ isHeader: true, cat: memCat });
                currentCat = memCat;
            }
            enhancedMembersData.push(mem);
        });
        return enhancedMembersData;
    }, [members.data]);

    const userMayInvite = !!membersData?.find(mem => (
        mem.isCurrent && mem.userRole !== 'guest' && mem.status !== 'invite'
    ));
    const groupSizeBelowMax = (group.data) && (group.data.memberCount < group.data.maxMembers);
    return <>{members.isLoading && <LoadingBlock />}
        {members.isSuccess && <Container maxWidth='lg'>
            {(userMayInvite) && <Box sx={barStyle}>
                <Button
                    component={Link}
                    variant='outlined'
                    disabled={!groupSizeBelowMax}
                    color='primary'
                    href={`/groups/${groupId}/members/invite`}
                    sx={noTransform}
                    startIcon={<GroupAdd />}>
                    {(groupSizeBelowMax) ? 'Nieuwe leden uitnodigen' : '(maximum aantal leden)'}
                </Button>
            </Box>}
            <Grid container spacing={2}>
                {membersData.map(member => (
                    (member.isHeader) ?
                        <Grid item xs={12} key={member.cat}>
                            <Typography variant='subtitle1' sx={subHeaderStyle}>
                                {(member.cat === 'admin') ? 'Admin leden'
                                    : (members.cat === 'guest') ? 'Gasten' : 'Uitgenodigd'}
                            </Typography>
                        </Grid>
                        : <Grid item xs={12} md={4} key={member.PK}>
                            <MemberCard memberPK={member.PK}
                                groupId={groupId}
                                name={member.name} email={member.email} since={member.createdAt}
                                photoUrl={member.photoUrl}
                                userRole={member.userRole} status={member.status}
                                isFounder={member.isFounder}
                                isCurrent={member.isCurrent}
                                options={member.options}
                            />
                        </Grid>
                ))}
            </Grid>
        </Container>}
    </>
}

export default function MemberPage({ path, groupId }) {
    return (
        <Protected>
            <GroupHeader path={path} groupId={groupId} />
            <MembersMain path={path} groupId={groupId} />
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