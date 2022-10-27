import * as React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GroupAdd from '@mui/icons-material/GroupAdd';
import { getSSRUser, Protected } from '../../../../src/Components/Protected';
import { getSSRRoute } from '../../../../src/utils/route-helper';
import { API } from 'aws-amplify';
import { useQuery } from '@tanstack/react-query';
import InviteWrapper from '../../../../src/Components/Forms/InviteWrapper';
import { makeImageUrl } from '../../../../src/utils/image-helper';
import InviteForm from '../../../../src/Components/Forms/InviteForm';

export default function MemberInvitePage({ groupId }) {
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

    const memberMails = React.useMemo(() => {
        if (!members.data) return null;
        const mails = members.data
            .filter(mem => mem.status !== 'invite')
            .map(mem => mem.email)
        return mails;
    }, [members.data]);

    const groupPhoto = makeImageUrl(group.data?.photo?.url, 500);
    const allowance = (group.data && (group.data.maxMembers - group.data.memberCount));

    return (
        <Protected>
            <InviteWrapper background={groupPhoto} narrow={true}>
                <InviteForm groupName={group.data?.name} groupId={groupId}
                    allowance={allowance}
                    memberMails={memberMails} />
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