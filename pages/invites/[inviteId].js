import * as React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { getSSRUser } from '../../src/Components/Protected';
import { withSSRContext } from 'aws-amplify';
import InviteWrapper from '../../src/Components/Forms/InviteWrapper';
import InviteDivider from '../../public/invite_divider.png';
import Image from 'next/image';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import { useUser } from '../../src/Components/UserContext';
import { useRouter } from 'next/router';
import { makeImageUrl } from '../../src/utils/image-helper';
import Link from '../../src/Components/Link';

// to prevent rerenders
const sxMb1 = { mb: 1 }
const sxMy1 = { my: 1 }
const sxMt1 = { mt: 1 }

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

const ErrorBlock = ({ error, groupId, user }) => {
    const title =
        (error === 'invite ID invalid') ? 'Ongeldige uitnodigingscode'
            : (error === 'invite not found') ? 'Uitnodiging niet gevonden'
                : (error === 'invite not for you') ?
                    (user.isAuthenticated) ? 'Uitnodiging is niet voor jou' : 'Uitnodiging is voor een lid'
                    : (error === 'invite already accepted') ? 'Uitnodiging al geaccepteerd'
                        : (error === 'invite expired') ? 'Uitnodiging verlopen'
                            : 'Fout bij ophalen uitnodiging';
    const lines =
        (error === 'invite ID invalid') ? ['De uitnodigingscode in de url is ongeldig',
            'Klik op de link in de email met de uitnodiging', 'of kopieer de link naar de browser']
            : (error === 'invite not found') ? ['Deze uitnodiging bestaat niet (meer)',
                'Misschien is bijbehorende groep ondertussen opgeheven',
                'Je kunt het beste degene die je heeft uitgenodigd direct benaderen als je uitnodigingsmail nog hebt']
                : (error === 'invite not for you') ?
                    (user.isAuthenticated) ? ['Deze uitnodiging is direct geadresseerd aan een ander lid',
                        'Waarschijnlijk niet voor jou, of je moet onder een ander account inloggen']
                        : ['Deze uitnodiging is direct geadresseerd aan een lid',
                            'Log in om de uitnodiging op te halen']
                    : (error === 'invite already accepted') ? ['Je hebt deze uitnodiging al geaccepteerd',
                        'Dus je bent al lid', 'De groep uit deze uitnodiging staat al tussen je groepen']
                        : (error === 'invite expired') ? ['Deze uitnodiging is verlopen',
                            'Je kunt het beste degene die je heeft uitgenodigd direct benaderen,',
                            'als je de email met de uitnodiging nog hebt']
                            : ['Er ging iets mis bij het ophalen van de uitnodiging', 'Probeer het later nog eens'];

    const [href, linkText] = (error === 'invite already accepted') ?
        (groupId) ? [`/groups/${groupId}`, '→ Bekijk de groep'] : ['/groups', '→ Ga naar mijn groepen']
        : (error === 'invite not for you' && !user.isAuthenticated) ?
            ['/login', '→ Log in']
            : ['', ''];

    return <>
        <Avatar width={40} height={40}>😳</Avatar>
        <Typography variant="h4" align='center' component="h1" sx={sxMt1} gutterBottom data-cy='error title'>
            {title}
        </Typography>
        <Typography variant="body1" align='center' sx={sxMy1} gutterBottom>
            {lines.map((line, i) => (
                <React.Fragment key={i}>{line}<br /></React.Fragment>
            ))}
        </Typography>
        {href && <Link href={href} data-cy='errorlink'>{linkText}</Link>}
    </>
}

// date helpers
const makeStr = (date) => {
    const yyyy = date.getFullYear();
    const m = date.getMonth() + 1;
    const mm = (m < 10) ? '0' + m : '' + m;
    const d = date.getDate();
    const dd = (d < 10) ? '0' + d : '' + d;
    return `${yyyy}-${mm}-${dd}`;
};
const expireDate = (dateStr) => {
    let expDate = new Date(dateStr);
    expDate.setDate(expDate.getDate() + 30);
    return makeStr(expDate);
};

const InviteBlock = ({ invite, user }) => {
    const addressee = invite.user?.name || 'vreemdeling'
    const addresseeMail = invite.user?.email || 'iemand anders';
    const username = user?.name || addressee;
    const isDifferentEmail = (user.email && invite.user?.email !== user.email);
    const invitedBy = invite.invitation?.from?.name || 'Iemand';
    const groupName = invite.group?.name || 'Een groep';
    const groupDescription = invite.group?.description;
    const message = invite.invitation?.message || '';
    const expires = expireDate(invite.createdAt) || 'nader order';

    return <>
        <Typography variant="h4" align='center' component="h1" gutterBottom>
            📩<br />Je bent uitgenodigd!
        </Typography>
        <Typography variant="body1" align='center' gutterBottom data-cy='intro1'>
            Beste {username},
        </Typography>
        <Typography variant="body1" align='center' gutterBottom data-cy='intro2'>
            {invitedBy} nodigt {' '}
            {(isDifferentEmail) ? addressee : 'je'} uit om lid te worden van<br />
        </Typography>
        <Typography variant="body1" align='center' sx={sxMb1}>
            {groupName} {groupDescription && ` - ${groupDescription}`}
        </Typography>
        <Image src={InviteDivider} alt='divider' width={64} height={32} />
        <Typography variant="body1" align='center' sx={sxMy1} gutterBottom>
            {message.split('\n').map((line, i) => (
                <React.Fragment key={i}>{line}<br /></React.Fragment>
            ))}
        </Typography>
        <Image src={InviteDivider} alt='divider' width={64} height={32} />
        {(isDifferentEmail) && <Typography variant='body2' align='center' sx={sxMt1} gutterBottom data-cy='other'>
            Deze uitnodiging is gericht aan {addresseeMail}.
            Dus wel zo netjes als je alleen accepteert als jij dit bent.
        </Typography>}
        <Typography variant='body2' align='center' sx={sxMy1} gutterBottom data-cy='valid until'>
            Deze uitnodiging is geldig tot{' '}{expires}
        </Typography>
        <Grid container alignItems='center' justifyContent='center' spacing={2} sx={sxMy1}>
            <Grid item>
                <Button onClick={() => alert('ok')} variant='contained' color='secondary' data-cy='accept'>
                    Accepteren
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={() => alert('nok')} variant='outlined' size='small' data-cy='reject'>
                    Afwijzen
                </Button>
            </Grid>
        </Grid>
    </>
}

export default function InvitePage(props) {
    // need to get user client side, because page reload is required when user logs out
    const { user } = useUser();
    const router = useRouter();
    const groupId = parseGroupId(router.query.inviteId);

    React.useEffect(() => {
        if (user.isAuthenticated !== props.user.isAuthenticated) {
            router.reload(window.location.pathname)
        };
    }, [user.isAuthenticated])

    const groupPhotoUrl = props.inviteResult?.group?.photo?.url
    const bgImage = (props.error) ?
        '/invite-error.jpg'
        : (groupPhotoUrl) ? makeImageUrl(groupPhotoUrl, 690) : '/invite-bg.jpg';

    return (
        <InviteWrapper background={bgImage}>
            {props.inviteResult && <InviteBlock invite={props.inviteResult} user={user} />}
            {props.error && <ErrorBlock error={props.error} groupId={groupId} user={user} />}
        </InviteWrapper>
    );
}

async function getSSRInvite(context) {
    const { API } = withSSRContext(context);
    const inviteId = context.params?.inviteId;
    try {
        const inviteResult = await API.get('blob-images', `/invites/${inviteId}`);
        return { inviteResult }
    } catch (err) {
        console.log(err.response.data)
        return err.response.data
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