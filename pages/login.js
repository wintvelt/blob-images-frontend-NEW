import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '../src/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useForm } from "react-hook-form";
import EmailField from '../src/Components/Forms/EmailField';
import { makeUser, useUser } from '../src/Components/UserContext';
import PasswordField from '../src/Components/Forms/PasswordField';
import { API, Auth } from 'aws-amplify';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import AuthWrapper from '../src/Components/Forms/AuthWrapper';
import LoginForm from '../src/Components/Forms/LoginForm';
import CreateAccountForm from '../src/Components/Forms/CreateAccountForm';

export default function SignInSide() {
    const { handleSubmit, control, setError, setFocus } = useForm({
        defaultValues: {
            email: '',
        }
    });
    const [accountInCreation, setAccountInCreation] = React.useState({
        email: null, tmpPassword: null
    });
    const router = useRouter();

    const onCreateAccount = (tmpUser) => {
        setAccountInCreation(tmpUser)
    }

    return (
        <AuthWrapper>
            {(!accountInCreation.email) && <LoginForm onCreateAccount={onCreateAccount} />}
            {(accountInCreation.email) &&
                <CreateAccountForm
                    onCreateAccount={onCreateAccount}
                    accountInCreation={accountInCreation}
                />}
        </AuthWrapper>
    );
}