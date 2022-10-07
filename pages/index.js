import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '../src/ProTip';
import Link from '../src/Link';
import { toast } from 'react-toastify';
import { useUser } from '../src/Components/UserContext';

export default function Index() {
    const boxStyle = { my: 4 };
    const { user } = useUser()

    const onProtectedLink = async (e) => {
        if (!user.isAuthenticated) {
            toast.error('Log eerst even in', { toastId: 'login-required' })
            e.preventDefault()
        }
    }

    return (
        <Container maxWidth="sm">
            <Box sx={boxStyle}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Next.js example
                </Typography>
                <Link href="/about" onClick={onProtectedLink}>
                    Go to the about page
                </Link>
                <ProTip />
            </Box>
        </Container>
    );
}