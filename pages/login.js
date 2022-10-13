import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '../src/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useForm } from "react-hook-form";
import EmailField from '../src/Components/Forms/EmailField';
import { useUser } from '../src/Components/UserContext';
import PasswordField from '../src/Components/Forms/PasswordField';
import { API, Auth } from 'aws-amplify';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function SignInSide() {
    const { handleSubmit, control, setError, setFocus } = useForm({
        defaultValues: {
            email: '',
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
            const userData = await API.get('blob-images', `/user`);
            const newUser = {
                isAuthenticated: true,
                name: authResult.attributes["custom:name"],
                email: authResult.attributes.email,
                photoUrl: userData.photoUrl
            };
            setUser(newUser);
            // redirect after login
            if (router.query.redirectTo) router.push(router.query.redirectTo)
        } catch (error) {
            if (error.name === 'NotAuthorizedException') {
                setError('password',
                { type: 'custom', message: 'Email of wachtwoord is niet correct' }
                )
            } else {
                // TODO: catch other errors, e.g. challenge when email not validated
                toast.error('Er ging iets mis. Check anders ff bij Wouter')
            }
            console.log('error signing in', error);
        }
        setIsLoading(false);
    };

    return (
        <Grid container component="main" sx={{ height: 'calc(100vh - 64px)' }}>
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: 'url(/login-bg.jpg)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: (t) => t.palette.grey[300] }}>
                        👋
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Welkom terug!
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
                        >
                            {isLoading ? <CircularProgress size='1.75rem' /> : 'Log in'}
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/forgotpassword" variant="body2">
                                    Wachtwoord vergeten?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    Aanmelden als feut
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>}
                    {(user.isAuthenticated) && <>
                        <Typography variant='body' sx={{ padding: '2rem' }}>
                            Mooi {user.name}, je bent weer ingelogd.
                            En top dat je hier weer bent vandaag.
                            Op deze pagina is niet zoveel meer te doen.
                            Bezoek anders je groepen, of een andere pagina.
                        </Typography>
                        <Link href='/groups'>Ga naar mijn groepen</Link>
                    </>}
                </Box>
            </Grid>
        </Grid>
    );
}