import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '../src/ProTip';
import Link from '../src/Link';
import { getSSRUser, Protected } from '../src/Components/Protected';

const boxMargin = { backgroundColor: '#00ccee' }

export default function About() {
    return (
        <Protected>
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
        </Protected>
    )
}

export async function getServerSideProps(context) {
    const user = await getSSRUser(context);
    return {
        props: {
            user
        }
    }
}