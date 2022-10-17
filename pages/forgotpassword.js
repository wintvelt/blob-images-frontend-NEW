import * as React from 'react';
import AuthWrapper from '../src/Components/Forms/AuthWrapper';
import ForgotPasswordForm from '../src/Components/Forms/ForgotPassWordForm';
import SetPasswordForm from '../src/Components/Forms/SetPasswordForm';

export default function ForgotPassword(props) {
    const [emailState, setEmailState] = React.useState({
        hasEmail: !!props.email,
        email: props.email || ''
    });

    return (
        <AuthWrapper>
            {!emailState.hasEmail && <ForgotPasswordForm email={emailState.email} setEmailState={setEmailState} />}
            {emailState.hasEmail && <SetPasswordForm email={emailState.email} code={props.code || ''} />}
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