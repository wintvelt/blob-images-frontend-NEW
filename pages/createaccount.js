import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '../src/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useForm } from "react-hook-form";
import { Auth } from 'aws-amplify';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import AuthWrapper from '../src/Components/Forms/AuthWrapper';
import NewPasswordField from '../src/Components/Forms/NewPasswordField';
import PasswordField from '../src/Components/Forms/PasswordField';
import EmailField from '../src/Components/Forms/EmailField';
import NameField from '../src/Components/Forms/NameField';
import OptinField from '../src/Components/Forms/OptinField';

export default function CreateAccount() {
    const { handleSubmit, control, setError, setFocus } = useForm({
        defaultValues: {
            email: '',
            name: '',
            tmpPassword: '',
            newPassword: '',
            optin: false
        }
    });
    const [isLoading, setIsLoading] = React.useState(false);

    // because autofocus does not work
    React.useEffect(() => {
        setFocus("tmpPassword");
    }, [setFocus]);

    const onSubmit = async data => {
        try {
            setIsLoading(true);
            toast.info('TODO');
        } catch (error) {
            toast.error('Er ging iets mis. Check anders ff bij Wouter');
            console.log(error.message)
        }
        setIsLoading(false);
    };

    return (
        <AuthWrapper>
            <Avatar sx={{ m: 1, bgcolor: (t) => t.palette.grey[300] }}>
                🥳
            </Avatar>
            <Typography component="h1" variant="h5" gutterBottom>
                Account aanmaken
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
                <EmailField control={control} />
                <NameField control={control} />
                <PasswordField control={control} isTmp={true} />
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
        </AuthWrapper>
    );
}