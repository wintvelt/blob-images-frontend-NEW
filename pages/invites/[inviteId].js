import * as React from 'react';
import { getSSRUser } from '../../src/Components/Protected';
import { withSSRContext } from 'aws-amplify';
import InviteWrapper from '../../src/Components/Forms/InviteWrapper';
import { useUser } from '../../src/Components/UserContext';
import { useRouter } from 'next/router';
import { makeImageUrl } from '../../src/utils/image-helper';
import ErrorBlock from '../../src/Components/InviteError';
import InviteBlock from '../../src/Components/InviteBlock';

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

export default function InvitePage(props) {
    // need to get user client side, because page reload is required when user logs out
    const { user } = useUser();
    const router = useRouter(); // router needed for reload
    const groupId = parseGroupId(props.inviteId);

    React.useEffect(() => {
        if (user.isAuthenticated !== props.user.isAuthenticated) {
            router.reload();
        };
    }, [user.isAuthenticated])

    const groupPhotoUrl = props.inviteResult?.group?.photo?.url
    const bgImage = (props.error) ?
        '/invite-error.jpg'
        : (groupPhotoUrl) ? makeImageUrl(groupPhotoUrl, 690) : '/invite-bg.jpg';

    return (
        <InviteWrapper background={bgImage}>
            {props.inviteResult && <InviteBlock invite={props.inviteResult} inviteId={props.inviteId} user={user} />}
            {props.error && <ErrorBlock error={props.error} groupId={groupId} user={user} />}
        </InviteWrapper>
    );
}

async function getSSRInvite(context) {
    const { API } = withSSRContext(context);
    const inviteId = context.params?.inviteId;
    try {
        const inviteResult = await API.get('blob-images', `/invites/${inviteId}`);
        return { inviteResult, inviteId }
    } catch (err) {
        console.log(err.response.data)
        return { ...err.response.data, inviteId }
    }
}

export async function getServerSideProps(context) {
    const user = await getSSRUser(context);
    const inviteData = await getSSRInvite(context)
    return {
        props: {
            user,
            ...inviteData
        }
    }
}