import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '../src/ProTip';
import Link from '../src/Link';
import { useUser } from '../src/Components/UserContext';

export default function About() {
    const { redirectUnAuth } = useUser();
    redirectUnAuth();
    // const boxMargin = { my: 4 }
    const boxMargin = { backgroundColor: '#00ccee' }
    return (
        <Container maxWidth="sm" sx={boxMargin}>
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Next.js example
                </Typography>
                <Link href="/about">
                    Go to the about page
                </Link>
                <ProTip />
            </Box>
        </Container>
    );
}