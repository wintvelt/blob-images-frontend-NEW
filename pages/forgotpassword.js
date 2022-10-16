import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '../src/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useForm } from "react-hook-form";
import EmailField from '../src/Components/Forms/EmailField';
import { Auth } from 'aws-amplify';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import AuthWrapper from '../src/Components/Forms/AuthWrapper';

export default function SignInSide() {
    const { handleSubmit, control, setError, setFocus } = useForm({
        defaultValues: {
            email: '',
        }
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [emailSent, setEmailSent] = React.useState(true);

    // because autofocus does not work
    React.useEffect(() => {
        setFocus("email");
    }, [setFocus]);

    const onSubmit = async data => {
        try {
            setIsLoading(true);
            await Auth.forgotPassword(data.email);
            toast.info('Email verstuurd - check je mailbox');
            setEmailSent(true);
        } catch (error) {
            toast.error('Er ging iets mis. Check anders ff bij Wouter');
            console.log(error.message)
        }
        setIsLoading(false);
    };

    const onRetry = () => {
        setEmailSent(false)
    }

    return (
        <AuthWrapper>
            {(!emailSent) && <>
                <Avatar sx={{ m: 1, bgcolor: (t) => t.palette.grey[300] }}>
                    🤔
                </Avatar>
                <Typography component="h1" variant="h5" gutterBottom>
                    Wachtwoord vergeten?
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
                    <Typography variant='body' component="p" mb={2}>
                        Vul je email adres in, en ik stuur je een mail waarmee
                        je een nieuw wachtwoord kunt instellen.
                    </Typography>
                    <EmailField control={control} />
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
                            <Link href="/login" variant="body2">
                                Toch inloggen
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/" variant="body2">
                                Aanmelden als feut
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </>}
            {(emailSent) && <>
                <Avatar sx={{ m: 1, bgcolor: (t) => t.palette.grey[300] }}>
                    📥
                </Avatar>
                <Typography component="h1" variant="h5" gutterBottom>
                    Verificatiecode verzonden
                </Typography>
                <Typography variant='body' component="p" mb={2}>
                    Check je inbox of je de verificatiecode hebt ontvangen. 
                    Klik dan op de link in de email, of op de knop hieronder.
                </Typography>
                <Button variant='contained' color='secondary' href='/verify' sx={{ mb: 2 }}>
                    Doorgaan
                </Button>
                <Button onClick={onRetry}>
                    Email opnieuw versturen
                </Button>
            </>}
        </AuthWrapper>
    );
}