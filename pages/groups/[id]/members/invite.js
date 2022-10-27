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
import InviteWrapper from '../../../../src/Components/Forms/InviteWrapper';
import { makeImageUrl } from '../../../../src/utils/image-helper';
import InviteForm from '../../../../src/Components/Forms/InviteForm';


const barStyle = {
    my: 2,
    // backgroundColor: '#eeeeee',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end'
};

const noTransform = { textTransform: 'none' }
const subHeaderStyle = { mt: 1, mb: -1 }

// helpers for sorting members and creating subheaders
const membersCat = (mem) => {
    if (mem.status === 'invite') return 'invite'
    if (mem.userRole === 'admin') return 'admin'
    return 'guest'
}
const memberSort = (a, b) => (
    (a.status === 'invite') ?
        (b.status === 'invite') ?
            (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0
            : 1
        : (b.status === 'invite') ?
            -1
            : (a.userRole === 'admin') ?
                (b.userRole === 'admin') ?
                    (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0
                    : -1
                : (b.userRole === 'admin') ?
                    1
                    : (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0
)

export default function MemberInvitePage({ path, groupId }) {
    const members = useQuery(['members', groupId], ({ signal }) => {
        const promise = API.get('blob-images', `/groups/${groupId}/members`);
        signal?.addEventListener('abort', () => {
            API.cancel(promise, "canceled albums get");
        });
        return promise;
    });
    const group = useQuery(['group', groupId], ({ signal }) => {
        const promise = API.get('blob-images', `/groups/${groupId}`);
        signal?.addEventListener('abort', () => {
            API.cancel(promise, "canceled albums get");
        });
        return promise;
    });

    const [membersData, memberMails] = React.useMemo(() => {
        if (!members.data) return [null, null];
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
        const mails = members.data
            .filter(mem => mem.status !== 'invite')
            .map(mem => mem.email)
        return [enhancedMembersData, mails];
    }, [members.data]);

    const groupPhoto = makeImageUrl(group.data?.photo?.url, 500);
    const allowance = (group.data && (group.data.maxMembers - group.data.memberCount));

    return (
        <Protected>
            <InviteWrapper background={groupPhoto} narrow={true}>
                <InviteForm groupName={group.data?.name} allowance={allowance} memberMails={memberMails} />
            </InviteWrapper>
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