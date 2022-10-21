import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '../Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useForm } from "react-hook-form";
import EmailField from './EmailField';
import { makeUser, useUser } from '../UserContext';
import PasswordField from './PasswordField';
import { API, Auth } from 'aws-amplify';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function LoginForm({ onCreateAccount }) {
    const { handleSubmit, control, setError, setFocus } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });
    const { user, setUser } = useUser();
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();

    // because autofocus does not work
    React.useEffect(() => {
        setFocus("email");
    }, [setFocus]);

    const onSubmit = async data => {
        try {
            setIsLoading(true);
            const authResult = await Auth.signIn(data.email, data.password);
            if (authResult.challengeName === 'NEW_PASSWORD_REQUIRED') {
                // ask for more info to create account
                onCreateAccount({
                    email: data.email,
                    tmpPassword: data.password
                })
            } else {
                const userData = await API.get('blob-images', `/user`);
                const newUser = makeUser(authResult, userData);
                setUser(newUser);
                setIsLoading(false);
                // redirect after login
                if (router.query.redirectTo) router.push(router.query.redirectTo)
            }
        } catch (error) {
            switch (error.message) {
                case 'Incorrect username or password.':
                    setError('password',
                        { type: 'custom', message: 'Email of wachtwoord is niet correct' });
                    break;
                case 'Password attempts exceeded':
                    toast.error('Je account is voor 15 minuten geblokkeerd - je kunt het later weer proberen');
                    break;
                // TODO: catch other errors, e.g. challenge when email not validated
                default:
                    toast.error('Er ging iets mis. Check anders ff bij Wouter');
                    break;
            }
            console.log(error.message)
            setIsLoading(false);
        }
    };

    return (
        <>
            <Avatar sx={{ m: 1, bgcolor: (t) => t.palette.grey[300] }}>
                👋
            </Avatar>
            <Typography component="h1" variant="h5">
                {(user.isAuthenticated) ? `Hi ${user.name || 'lid'}!` : 'Welkom terug!'}
            </Typography>
            {(!user.isAuthenticated) && <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
                <EmailField control={control} />
                <PasswordField control={control} />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isLoading}
                    data-cy='submit'
                >
                    {isLoading ? <CircularProgress size='1.75rem' /> : 'Log in'}
                </Button>
                <Grid container>
                    <Grid item xs>
                        <Link href="/forgotpassword" variant="body2" data-cy='forgot password link'>
                            Wachtwoord vergeten?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="/" variant="body2">
                            Aanmelden als feut
                        </Link>
                    </Grid>
                </Grid>
            </Box>}
            {(user.isAuthenticated) && <>
                <Typography variant='body' sx={{ mx: '2rem', mt: '2rem' }}>
                    Mooi {user.name}, je bent weer ingelogd.
                    En top dat je hier weer bent vandaag.
                </Typography>
                <Typography variant='body' sx={{ mx: '2rem', my: '1rem' }}>
                    Op deze pagina is niet zoveel meer te doen.
                    Bezoek anders je groepen, of een andere pagina.
                </Typography>
                <Link href='/groups' data-cy='logged in'>→ Ga naar mijn groepen</Link>
            </>}
        </>
    );
}