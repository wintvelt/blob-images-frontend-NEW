import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useForm } from "react-hook-form";
import EmailField from '../src/Components/Forms/EmailField';
import { Auth } from 'aws-amplify';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import AuthWrapper from '../src/Components/Forms/AuthWrapper';
import CodeField from '../src/Components/Forms/CodeField';
import NewPasswordField from '../src/Components/Forms/NewPasswordField';
import { useRouter } from 'next/router';

export default function SetPassword({ email = '', code = '' }) {
    const { handleSubmit, control, trigger, setFocus } = useForm({
        defaultValues: {
            email,
            code,
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
            toast.error('Er ging iets mis. Check anders ff bij Wouter');
            console.log(error.message)
            setIsLoading(false);
        }
    };

    const onRetry = async () => {
        try {
            const result = await trigger('email');
            if (result) await Auth.forgotPassword(data.email);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AuthWrapper>
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
                    {isLoading ? <CircularProgress size='1.75rem' /> : 'Verstuur'}
                </Button>
            </Box>
            <Button onClick={onRetry} size="small">
                Mail mij een nieuwe code
            </Button>
        </AuthWrapper >
    );
}

export async function getServerSideProps(context) {
    const { email = null, code = null } = context.query
    return {
        props: {
            email, code
        }
    }
}