import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '../src/ProTip';
import Link from '../src/Components/Link';
import { getSSRRoute } from '../src/utils/route-helper';
import { getSSRUser } from '../src/Components/Protected';

export default function Index() {
    const boxStyle = { my: 4 };

    return (
        <Container maxWidth="sm">
            <Box sx={boxStyle}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Example Home page
                </Typography>
                <Link href="/groups/GnDhE9WzayoleqJ_" protected={true}>
                    Go to a protected groups page
                </Link>
                <ProTip />
            </Box>
        </Container>
    );
}

export async function getServerSideProps(context) {
    const routeData = getSSRRoute(context)
    const user = await getSSRUser(context)
    return {
        props: {
            ...routeData,
            user
        }
    }
}