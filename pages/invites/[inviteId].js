import * as React from 'react';
import { API } from 'aws-amplify';
import { useQuery } from '@tanstack/react-query';
import userQueryFn, { authQueryFn } from '../../src/data/user';
import InviteWrapper from '../../src/Components/Forms/InviteWrapper';
import { makeImageUrl } from '../../src/utils/image-helper';
import ErrorBlock from '../../src/Components/InviteError';
import InviteBlock from '../../src/Components/InviteBlock';
import LoadingBlock from '../../src/Components/LoadingBlock';

// get groupID from inviteId for errors (when invite is not passed from server)
const btoa = (b) => Buffer.from(b, 'base64').toString();
const parseGroupId = (inviteId) => {
    try {
        const keys = JSON.parse(btoa(inviteId))
        return keys.SK
    } catch (error) {
        return undefined
    }
}

async function inviteQueryFn(queryCtx) {
    const inviteId = queryCtx.queryKey[1]
    const inviteData = await API.get('blob-images', `/invites/${inviteId}`)
    return inviteData
}

export default function InvitePage(props) {
    const groupId = parseGroupId(props.inviteId);
    const authData = useQuery(['auth'], authQueryFn);
    const isAuthenticated = !!authData.data;
    const userData = useQuery(['user', isAuthenticated], userQueryFn, { enabled: isAuthenticated });
    const inviteData = useQuery(['invite', props.inviteId], inviteQueryFn, {
        enabled: !!props.inviteId,
        retry: false
    });
    const invite = inviteData.data;

    const groupPhotoUrl = invite?.group?.photo?.url
    const bgImage = (props.error) ?
        '/invite-error.jpg'
        : (groupPhotoUrl) ? makeImageUrl(groupPhotoUrl, 690) : '/invite-bg.jpg';

    const isError = (inviteData.isError);
    const isLoading = !isError &&
        (authData.isLoading || (isAuthenticated && userData.isLoading) || inviteData.isLoading);
    const error = inviteData.error?.response?.data?.error;

    return (
        <InviteWrapper background={bgImage}>
            {inviteData.isSuccess &&
                <InviteBlock invite={invite} inviteId={props.inviteId} user={userData.data} />}
            {isError &&
                <ErrorBlock error={error} groupId={groupId} user={userData.data} />}
            {isLoading && <LoadingBlock />}
        </InviteWrapper>
    );
}

// Note: Abandoned server-side fetching of invite, because it caused complicated Hydration errors

// async function getSSRInvite(context) {
//     const inviteId = context.params?.inviteId;
//     try {
//         const { API } = withSSRContext(context);
//         const inviteResult = await API.get('blob-images', `/invites/${inviteId}`);
//         return { inviteResult, inviteId }
//     } catch (err) {
//         console.log(err.response.data)
//         return { ...err.response.data, inviteId }
//     }
// }

export async function getServerSideProps(context) {
    const inviteId = context.params?.inviteId;
    return {
        props: {
            inviteId
        }
    }
}