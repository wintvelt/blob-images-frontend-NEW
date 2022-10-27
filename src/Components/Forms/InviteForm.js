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

export default function InviteForm({ onInvite, groupName, allowance = 1, memberMails }) {
    const { handleSubmit, control, setError, setFocus, getValues } = useForm({
        defaultValues: { inviteText: '' }
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'invitees',
        defaultValues: { admin: true }
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const mayInviteMore = (allowance - fields.length) > 1;

    // const emails = watch({ control, name: ['inviteeEmail', 'invitees'] });

    // because autofocus does not work
    React.useEffect(() => {
        setFocus("inviteeName");
    }, [setFocus]);

    const onSubmit = async data => {
        setIsLoading(true);
        try {
            // submit stuff
            setIsLoading(false);
        } catch (error) {
            toast.error(error)
            setIsLoading(false);
        }
    };

    return (
        <>
            <Avatar sx={{ m: 1, bgcolor: (t) => t.palette.grey[300] }}>
                ✍️
            </Avatar>
            <Typography component="h1" variant="h5" gutterBottom>
                Leden uitnodigen
            </Typography>
            <Typography variant='body'>
                Voor {groupName}
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}
                sx={formStyle}>
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
            </Box>
            <pre>watched</pre>
            {/* <pre>{JSON.stringify(emails, null, 2)}</pre> */}
        </>
    );
}