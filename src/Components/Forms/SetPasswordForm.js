import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useForm } from "react-hook-form";
import EmailField from './EmailField';
import { Auth } from 'aws-amplify';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import CodeField from './CodeField';
import NewPasswordField from './NewPasswordField';
import { useRouter } from 'next/router';

export default function SetPasswordForm({ email, code }) {
    const { handleSubmit, control, trigger, getValues, setError, setFocus } = useForm({
        defaultValues: {
            email: email || '',
            code: code || '',
            newPassword: ''
        }
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();

    // because autofocus does not work
    React.useEffect(() => {
        const focusField = !email ? 'email'
            : !code ? 'code'
                : 'newPassword';
        setFocus(focusField);
    }, [setFocus]);

    const onSubmit = async data => {
        try {
            const { email, code, newPassword } = data;
            setIsLoading(true);
            await Auth.forgotPasswordSubmit(email, code, newPassword);
            await Auth.signIn(email, newPassword);
            router.push('/');
        } catch (error) {
            console.log(error.message)
            const isInvalidCode = (error.message && error.message.includes('Invalid verification code'))
            const isLimitExceeded = (error.message && error.message.includes('limit exceeded'))
            if (isInvalidCode || isLimitExceeded) {
                const message = (isInvalidCode) ?
                    'ongeldige code, check je inbox of vraag opnieuw aan'
                    : 'te veel pogingen, probeer het later nog eens';
                setError(
                    'code',
                    { type: 'invalidCode', message },
                    { shouldFocus: isInvalidCode }
                );
            } else {
                console.log(error.message)
                toast.error('Er ging iets mis. Check anders ff bij Wouter');
            }
            setIsLoading(false);
        }
    };

    const onRetry = async () => {
        try {
            const result = await trigger('email');
            if (result) {
                const data = getValues();
                await Auth.forgotPassword(data.email);
                toast.info('Email verstuurd, check je inbox');
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Avatar sx={{ m: 1, bgcolor: (t) => t.palette.grey[300] }}>
                🙈
            </Avatar>
            <Typography component="h1" variant="h5" gutterBottom>
                Nieuw wachtwoord instellen
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
                <EmailField control={control} />
                <CodeField control={control} />
                <NewPasswordField control={control} />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress size='1.75rem' /> : 'Opslaan'}
                </Button>
            </Box>
            <Button onClick={onRetry} size="small" fullWidth variant='outlined'>
                Mail mij een nieuwe code
            </Button>
        </>
    );
}