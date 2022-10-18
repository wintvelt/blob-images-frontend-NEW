import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AuthWrapper from '../src/Components/Forms/AuthWrapper';
import ForgotPasswordForm from '../src/Components/Forms/ForgotPassWordForm';
import SetPasswordForm from '../src/Components/Forms/SetPasswordForm';
import Link from '../src/Components/Link';

/* This page has 3 states
    - codeRequest: user can fill in email and request code <ForgotPassWordForm/>
        a) if no email address in url
    - verifyCode: <SetPasswordForm/>
        a) if url contains email
        b) after successful code request, 
        c) on user click
    - success: (inline on this page)
        only after successful validation

    email can be known through 
    a) props (from url) or 
    b) state filled in by user in start state
*/
export default function ForgotPassword(props) {
    const [pageState, setPageState] = React.useState({
        show: (props.email) ? 'verifyCode' : 'codeRequest',
        email: props.email || '' // null from server if empty, so convert to string
    });

    return (
        <AuthWrapper>
            {(pageState.show === 'codeRequest') &&
                <ForgotPasswordForm email={pageState.email} setPageState={setPageState} />
            }
            {(pageState.show === 'verifyCode') &&
                <SetPasswordForm email={pageState.email} code={props.code || ''} setPageState={setPageState} />
            }
            {(pageState.show === 'success') && <>
                <Avatar sx={{ m: 1, bgcolor: (t) => t.palette.grey[300] }}>
                    🥳
                </Avatar>
                <Typography component="h1" variant="h5" gutterBottom>
                    Je bent binnen!
                </Typography>
                <Typography variant='body' component="p" mb={2}>
                    Gefeliciteerd, je account is bevestigd en je bent ingelogd.
                </Typography>
                <Typography variant='body' component="p" mb={2}>
                    Op je eigen pagina kun je de groepen vinden waar je lid van bent.
                    Of zelf een nieuwe groep maken.
                </Typography>
                <Link href='/groups'>→ Ga naar mijn groepen</Link>
            </>}
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