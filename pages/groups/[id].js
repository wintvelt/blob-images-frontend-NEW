import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '../../src/ProTip';
import Link from '../../src/Link';
import { getSSRUser, Protected } from '../../src/Components/Protected';

const boxMargin = { backgroundColor: '#00ccee' }

export default function GroupPage() {
    return (
        <Protected>
            <Container maxWidth="sm" sx={boxMargin}>
                <Box sx={{ my: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Group page
                    </Typography>
                    <Link href="/">
                        Go to home page
                    </Link>
                    <ProTip />
                </Box>
            </Container>
        </Protected>
    )
}

export async function getServerSideProps(context) {
    const user = await getSSRUser(context);
    const group = (user.isAuthenticated)? await getSSRGroup(context) : undefined;
    return {
        props: {
            user
        }
    }
}