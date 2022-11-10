import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '../src/ProTip';
import Link from '../src/Components/Link';
import { isAuthUser } from '../src/Components/Protected';
import { getSSRRoute } from '../src/utils/route-helper';
import PersonalHeader from '../src/Components/PersonalHeader';

const boxMargin = { backgroundColor: '#00ccee' }

function MyGroupsPage({ path }) {
    return (
        <>
            <PersonalHeader path={path} />
            <Container maxWidth="sm" sx={boxMargin}>
                <Box sx={{ my: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        My Photos Page
                    </Typography>
                    <Link href="/">
                        Go to home page
                    </Link>
                    <ProTip />
                </Box>
            </Container>
        </>
    )
}

MyGroupsPage.whyDidYouRender = true

export default MyGroupsPage

export async function getServerSideProps(context) {
    const routeData = getSSRRoute(context)
    const isAuthenticated = await isAuthUser(context)
    return (isAuthenticated) ?
        {
            props: {
                ...routeData
            }
        }
        : { redirect: { destination: '/login' } }
}