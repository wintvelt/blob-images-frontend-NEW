import * as React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InviteDivider from '../../public/invite_divider.png';
import Image from 'next/image';
import Grid from '@mui/material/Grid';

// to prevent rerenders
const sxMb1 = { mb: 1 }
const sxMy1 = { my: 1 }
const sxMt1 = { mt: 1 }

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

export default InviteBlock;