import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '../Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useForm } from "react-hook-form";
import EmailField from './EmailField';
import { Auth } from 'aws-amplify';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';

export default function ForgotPasswordForm(props) {
    const { handleSubmit, control, getValues, setFocus } = useForm({
        defaultValues: {
            email: props.email,
        }
    });
    const [isLoading, setIsLoading] = React.useState(false);

    // because autofocus does not work
    React.useEffect(() => {
        setFocus("email");
    }, [setFocus]);

    const onSubmit = async data => {
        try {
            setIsLoading(true);
            await Auth.forgotPassword(data.email);
            toast.info('Email verstuurd - check je mailbox');
            props.setPageState({
                show: 'verifyCode',
                email: data.email
            });
        } catch (error) {
            const isLimitExceeded = (error.message && error.message.includes('Attempt limit exceeded'))
            const msg = (isLimitExceeded) ?
                'Te veel pogingen, probeer het later nog eens'
                : 'Er ging iets mis. Check anders ff bij Wouter';
            toast.error(msg);
            console.log(error.message)
            setIsLoading(false);
        }
    };

    const onHasCode = () => {
        const data = getValues();
        props.setPageState({
            show: 'verifyCode',
            email: data.email
        })
    };

    return (
        <>
            <Avatar sx={{ m: 1, bgcolor: (t) => t.palette.grey[300] }}>
                🤔
            </Avatar>
            <Typography component="h1" variant="h5" gutterBottom>
                Wachtwoord vergeten?
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
                <Typography variant='body' component="p" mb={2}>
                    Vul je email adres in, dan ontvang je een mail waarmee
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
            </Box>
            <Button onClick={onHasCode} size="small" fullWidth variant='outlined'>
                Ik heb al een code
            </Button>
        </>
    );
}