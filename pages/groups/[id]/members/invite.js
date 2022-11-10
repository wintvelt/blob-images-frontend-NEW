import * as React from 'react';
import { isAuthUser } from '../../../../src/Components/Protected';
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
        <InviteWrapper background={groupPhoto} narrow={true}>
            <InviteForm groupName={group.data?.name} groupId={groupId}
                allowance={allowance}
                memberMails={memberMails} />
        </InviteWrapper>
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