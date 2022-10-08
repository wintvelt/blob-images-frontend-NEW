import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '../src/ProTip';
import Link from '../src/Link';

export default function Index() {
    const boxStyle = { my: 4 };

    return (
        <Container maxWidth="sm">
            <Box sx={boxStyle}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Next.js example
                </Typography>
                <Link href="/groups/GnDhE9WzayoleqJ_" protected={true}>
                    Go to a protected groups page
                </Link>
                <ProTip />
            </Box>
        </Container>
    );
}