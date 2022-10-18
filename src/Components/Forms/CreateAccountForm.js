import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '../Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useForm } from "react-hook-form";
import NameField from './NameField';
import NewPasswordField from './NewPasswordField';
import OptinField from './OptinField';
import { makeUser, useUser } from '../UserContext';
import { API, Auth } from 'aws-amplify';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function CreateAccountForm({ onCreateAccount, accountInCreation }) {
    const { handleSubmit, control, setError, setFocus } = useForm({
        defaultValues: {
            name: '',
            newPassword: '',
            optin: false
        }
    });
    const { email, tmpPassword } = accountInCreation;
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();

    // because autofocus does not work
    React.useEffect(() => {
        setFocus("name");
    }, [setFocus]);

    const onSubmit = async data => {
        setIsLoading(true);
        try {
            const authResult = await Auth.completePassword(email, data.name, tmpPassword, data.newPassword);
            setIsLoading(false);
        } catch (error) {
            toast.error(error)
            setIsLoading(false);
        }
    };

    return (
        <>
            <Avatar sx={{ m: 1, bgcolor: (t) => t.palette.grey[300] }}>
                🥳
            </Avatar>
            <Typography component="h1" variant="h5" gutterBottom>
                Account aanmaken
            </Typography>
            <Typography variant='body'>
                Vul je gegevens aan en kies een wachtwoord om een account aan te maken.
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
                <NameField control={control} />
                <NewPasswordField control={control} />
                <OptinField control={control} />
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
                <Grid container>
                    <Grid item xs>
                        <Button onClick={() => onCreateAccount({ email: null })} size='small'>
                            Inloggen in ander account
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}