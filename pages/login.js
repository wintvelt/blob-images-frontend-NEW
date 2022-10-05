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
import PasswordField from '../src/Components/Forms/PasswordField';

export default function SignInSide() {
    const { handleSubmit, control, setError, setFocus } = useForm({
        defaultValues: {
            email: '',
        }
    });

    // autofocus does not work
    React.useEffect(() => {
        setFocus("email");
      }, [setFocus]);

    const onSubmit = data => {
        setError("password", { type: 'custom', message: 'Ongeldige combinatie van email en password' })
        console.log(data);
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
                    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
                        <EmailField control={control} />
                        <PasswordField control={control} />
                        {/* <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        /> */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="secondary"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Log in
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Wachtwoord vergeten?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    Aanmelden als feut
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}