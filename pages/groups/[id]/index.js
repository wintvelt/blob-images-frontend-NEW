import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '../../../src/ProTip';
import Link from '../../../src/Components/Link';
import { getSSRUser, Protected } from '../../../src/Components/Protected';
import { getSSRRoute } from '../../../src/utils/route-helper';
import GroupHeader from '../../../src/Components/GroupHeader';

const boxMargin = { backgroundColor: '#00ccee' }

export default function GroupPage({ path, groupId }) {
    return (
        <Protected>
            <GroupHeader path={path} groupId={groupId} />
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
    const routeData = getSSRRoute(context)
    return {
        props: {
            user,
            ...routeData
        }
    }
}