import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AuthWrapper from '../src/Components/Forms/AuthWrapper';
import ForgotPasswordForm from '../src/Components/Forms/ForgotPassWordForm';
import SetPasswordForm from '../src/Components/Forms/SetPasswordForm';

export default function ForgotPassword(props) {
    const [email, setEmail] = React.useState(props.email || '');

    return (
        <AuthWrapper>
            {!email && <ForgotPasswordForm email={email} setEmail={setEmail} />}
            {email && <SetPasswordForm email={email} code={props.code} />}
        </AuthWrapper>
    );
};

export async function getServerSideProps(context) {
    const { email = null, code = null } = context.query
    return {
        props: {
            email, code
        }
    }
};