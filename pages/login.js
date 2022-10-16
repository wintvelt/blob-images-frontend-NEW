import * as React from 'react';
import AuthWrapper from '../src/Components/Forms/AuthWrapper';
import LoginForm from '../src/Components/Forms/LoginForm';
import CreateAccountForm from '../src/Components/Forms/CreateAccountForm';

export default function Login() {
    const [accountInCreation, setAccountInCreation] = React.useState({
        email: null, tmpPassword: null
    });

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