import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useFieldArray, useForm } from "react-hook-form";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import { toast } from 'react-toastify';
import NameField from './NameField';
import EmailField from './EmailField';
import InviteAdminField from './InviteAdminField';
import InviteMessageField from './InviteMessageField';
import Link from '../Link';
import { API } from 'aws-amplify';

// debug helper
const delay = ms => new Promise(res => setTimeout(res, ms));

const InviteeFormLine = ({ control, i, remove, getValues, memberMails }) => {
    const nameFieldName = (i > -1) ? `invitees.${i}.name` : 'inviteeName';
    const emailFieldName = (i > -1) ? `invitees.${i}.email` : 'inviteeEmail';
    const adminFieldName = (i > -1) ? `invitees.${i}.admin` : 'inviteeAdmin';
    return <Grid container spacing={{ xs: 1, md: 2 }}>
        <Grid item xs={5} md={5}>
            <NameField control={control} fieldName={nameFieldName} size='small'
                reqHelper='Vul een naam in' />
        </Grid>
        <Grid item xs={5} md={5}>
            <EmailField control={control} fieldName={emailFieldName} size='small'
                getValues={getValues} memberMails={memberMails} />
        </Grid>
        <Grid item xs={1} md={1}>
            <InviteAdminField control={control} fieldName={adminFieldName} showLabel={(i === -1)} />
        </Grid>
        {(i > -1) && <Grid item xs={1} md={1}>
            <IconButton size='small' onClick={() => remove(i)} sx={{ mt: 1.5 }}>
                <ClearIcon fontSize='small' />
            </IconButton>
        </Grid>}
    </Grid>
}
const formStyle = { mt: 2, width: '100%' }

export default function InviteForm({ groupName, groupId, allowance = 1, memberMails }) {
    const { handleSubmit, control, setFocus, getValues } = useForm({
        defaultValues: { inviteText: '' }
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'invitees',
        defaultValues: { admin: true }
    });
    const mayInviteMore = (allowance - fields.length) > 1;

    const [isLoading, setIsLoading] = React.useState(false);
    const [inviteState, setInviteState] = React.useState({ isInitial: true })

    // because autofocus does not work
    React.useEffect(() => {
        setFocus("inviteeName");
    }, [setFocus]);

    const onSubmit = async data => {
        setIsLoading(true);
        try {
            // submit stuff
            const invites = [
                { name: data.inviteeName, email: data.inviteeEmail, admin: inviteeAdmin },
                ...data.invitees
            ];
            const promises = invites.map(invite => (
                API.post('blob-images', `/groups/${groupId}/invite`, {
                    body: {
                        toName: invite.name,
                        toEmail: invite.email,
                        message: data.message,
                        role: (invite.admin) ? 'admin' : 'guest'
                    }
                })
            ))
            await Promise.all(promises)
            toast.success('Gelukt!')
            setInviteState({ isSuccess: true, numSent: invites.length + 1 })
        } catch (error) {
            toast.error('😢 er ging iets mis');
            setInviteState({ isError: true, message: error.message })
            setIsLoading(false);
        }
    };

    return (
        <>
            <Avatar sx={{ m: 1, bgcolor: (t) => t.palette.grey[300] }}>
                {(inviteState.isError) ? '😳' : '✍️'}
            </Avatar>
            <Typography component="h1" variant="h5" gutterBottom>
                {(inviteState.isInitial) ? 'Leden uitnodigen'
                    : (inviteState.isSuccess) ? 'Uitnodiging verzonden'
                        : 'Verzenden mislukt'
                }
            </Typography>
            <Typography variant='body'>
                Voor {groupName}
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}
                sx={formStyle}>
                {(inviteState.isInitial) && <>
                    <InviteeFormLine i={-1} control={control} memberMails={memberMails} />
                    {fields.map((item, index) => (
                        <InviteeFormLine key={item.id} i={index} control={control} remove={remove}
                            getValues={getValues} memberMails={memberMails} />
                    ))}
                    {(mayInviteMore) && <Button fullWidth onClick={() => append({ name: '' })}>
                        Nog iemand uitnodigen
                    </Button>}
                    <InviteMessageField control={control} />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size='1.75rem' /> : 'Verstuur'}
                    </Button>
                </>}
                {(inviteState.isSuccess) && <Box sx={{ mx: { xs: '1rem', md: '4rem' } }}>
                    <Typography variant='body1' sx={{ mt: '2rem' }}>
                        {inviteState.numSent} uitnodigingen zijn verzonden.
                        Zodra de ontvangers gereageerd hebben, krijg je hiervan bericht.
                    </Typography>
                    <Typography variant='body1' sx={{ my: '1rem' }}>
                        Op deze pagina is niet zoveel meer te doen.
                        Ga anders terug naar de groepspagina.
                    </Typography>
                    <Link href={`/groups/${groupId}`} data-cy='invite-success'>
                        → Ga naar {groupName}
                    </Link>
                </Box>}
                {(inviteState.isError) && <Box sx={{ mx: { xs: '1rem', md: '4rem' } }}>
                    <Typography variant='body1' sx={{ mt: '2rem' }}>
                        Helaas, het is niet gelukt om de uitnodigingen te verzenden.
                        De foutmelding is {JSON.stringify(inviteState.message)}
                    </Typography>
                    <Typography variant='body1' sx={{ my: '1rem' }}>
                        Probeer het anders later nog een keer.
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Link href={`/groups/${groupId}`} data-cy='invite-success'>
                            → Ga naar {groupName}
                        </Link>
                        <Button onClick={() => setInviteState({ isInitial: true })}>
                            Probeer opnieuw
                        </Button>
                    </Box>
                </Box>}
            </Box>
        </>
    );
}