import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '../src/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useForm } from "react-hook-form";
import EmailField from '../src/Components/Forms/EmailField';
import { makeUser, useUser } from '../src/Components/UserContext';
import { API, Auth } from 'aws-amplify';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import AuthWrapper from '../src/Components/Forms/AuthWrapper';
import PasswordField from '../src/Components/Forms/PasswordField';

export default function SignInSide() {
    const { handleSubmit, control, setError, setFocus } = useForm({
        defaultValues: {
            email: '',
        }
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();

    // because autofocus does not work
    React.useEffect(() => {
        setFocus("email");
    }, [setFocus]);

    const onSubmit = async data => {
        try {
            setIsLoading(true);
            await Auth.forgotPassword(data.email);
            toast.info('Email verstuurd - check je mailbox')
            // TODO: redirect to setpassword page
        } catch (error) {
            toast.error('Er ging iets mis. Check anders ff bij Wouter');
            console.log(error.message)
        }
        setIsLoading(false);
    };

    return (
        <AuthWrapper>
            <Avatar sx={{ m: 1, bgcolor: (t) => t.palette.grey[300] }}>
                🤔
            </Avatar>
            <Typography component="h1" variant="h5" gutterBottom>
                Wachtwoord vergeten?
            </Typography>
            <Typography variant='body' sx={{ px: '2rem' }}>
                Vul je email adres in, en ik stuur je een mail waarmee
                je een nieuw wachtwoord kunt instellen.
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
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
                        <Link href="#" variant="body2">
                            Aanmelden als feut
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </AuthWrapper>
    );
}