import * as React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InviteDivider from '../../public/invite_divider.png';
import Image from 'next/image';
import Grid from '@mui/material/Grid';
import { CircularProgress } from '@mui/material';
import { API } from 'aws-amplify';
import { useRouter } from 'next/router';
import Link from './Link';
import { useQueryClient } from '@tanstack/react-query';

// to prevent rerenders
const sxMb1 = { mb: 1 }
const sxMy1 = { my: 1 }
const sxMt1 = { mt: 1 }
const sxWidth = { width: '8rem' }

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

const OpenInvite = ({ invite, user }) => {
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
    </>
}

const InviteButtons = ({ onAccept, onDecline }) => {
    const [isLoading, setIsLoading] = React.useState(false);

    const onHandle = (lambda) => () => {
        // this only works because when accept or decline is clicked, the page state will change, 
        // and this Button block will unmount
        setIsLoading(true);
        lambda();
    };

    return <>
        <Grid container alignItems='center' justifyContent='center' spacing={2} sx={sxMy1}>
            <Grid item>
                <Button onClick={onHandle(onAccept)} variant='contained' color='secondary' data-cy='accept'
                    disabled={isLoading} sx={sxWidth}>
                    {isLoading ? <CircularProgress size='1.75rem' /> : 'Accepteren'}
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={onHandle(onDecline)} variant='outlined' size='small' data-cy='reject'
                    disabled={isLoading} sx={sxWidth}>
                    {isLoading ? <CircularProgress size='1.75rem' /> : 'Afwijzen'}
                </Button>
            </Grid>
        </Grid>
    </>
}

const AcceptedMessage = ({ invite }) => {
    const groupName = invite.group?.name || 'de groep';
    const groupId = invite.SK;
    return <>
        <Typography variant="h4" align='center' component="h1" gutterBottom>
            🍻<br />Welkom!
        </Typography>
        <Typography variant="body1" align='center' component="h1" gutterBottom>
            Je bent nu lid van {groupName}!<br />
            Klik op de link hieronder om de groepspagina te bekijken
        </Typography>
        <Link href={`/groups/${groupId}`}>→ Naar {groupName}</Link>
    </>
}
const DeclinedMessage = ({ invite, user }) => {
    const groupName = invite.group?.name || 'de groep';
    const invitorName = invite.invitation?.from?.name || 'iemand';
    return <>
        <Typography variant="h4" align='center' component="h1" gutterBottom>
            🤜<br />Afgewezen
        </Typography>
        <Typography variant="body1" align='center' component="h1" gutterBottom>
            De uitnodiging door {invitorName},<br />
            om lid te worden van {groupName} is afgewezen<br />
            {invitorName} is op de hoogte gesteld
        </Typography>
        {(!user.isAuthenticated) && <Typography variant="body1" align='center' component="h1" gutterBottom>
            Ik zie je in de toekomst graag nog eens terug
        </Typography>}
        {(user.isAuthenticated) && <Link href={`/groups`}>→ Naar mijn groepen</Link>}
    </>
}
const ErrorMessage = ({ invite, pageState }) => {
    const error = pageState.slice(8);
    const title = (error === 'accept failed') ?
        'Acceptatie mislukt'
        : (error === 'decline failed') ?
            'Afwijzing mislukt'
            : 'Er ging iets mis';

    const message = (error === 'accept failed') ?
        'Het is niet gelukt je acceptatie van deze uitnodiging te verwerken. Probeer het later nog eens.'
        : (error === 'decline failed') ?
            'Het is niet gelukt je afwijzing van deze uitnodiging te verwerken. Probeer het later nog eens.'
            : 'Probeer het later nog eens';
    return <>
        <Typography variant="h4" align='center' component="h1" gutterBottom>
            😱<br />{title}
        </Typography>
        <Typography variant="body1" align='center' component="h1" gutterBottom>
            {message}
        </Typography>
    </>
}

const InviteBlock = ({ invite, inviteId, user }) => {
    const [pageState, setPageState] = React.useState('open');
    const router = useRouter();
    const queryClient = useQueryClient(); // to invalidate = reload groups after acceptance

    const onAccept = async () => {
        if (user.isAuthenticated) {
            try {
                // invite can be addressed to any email or to this user
                await API.post('blob-images', `/invites/${inviteId}`);
                queryClient.invalidateQueries(["groups"]);
                setPageState('accepted')
            } catch (error) {
                setPageState('Error - accept failed')
            }
        } else {
            // invite must be to email, not userId: otherwise unauth user would not be allowed to accept
            const email = invite.SK.slice(2);
            // redirect to signup and pass inviteId and email
            router.push(`/signup?email=${email}&inviteId=${inviteId}`)
        }
        setPageState('accepted')
    }

    const onDecline = async () => {
        try {
            await API.del('blob-images', `/invites/${inviteId}`);
            setPageState('declined')
        } catch (error) {
            setPageState('Error - decline failed')
        }
    }

    return <>
        {(pageState === 'open') && <OpenInvite invite={invite} user={user} />}
        {(pageState === 'open') && <InviteButtons onAccept={onAccept} onDecline={onDecline} />}
        {(pageState === 'accepted') && <AcceptedMessage invite={invite} />}
        {(pageState === 'declined') && <DeclinedMessage invite={invite} user={user} />}
        {(pageState.indexOf('Error') === 0) && <ErrorMessage invite={invite} pageState={pageState} />}
    </>
}

export default InviteBlock;