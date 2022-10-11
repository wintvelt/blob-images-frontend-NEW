import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '../../src/ProTip';
import Link from '../../src/Link';
import { getSSRUser, Protected } from '../../src/Components/Protected';
import { getSSRRoute } from '../../src/utils/route-helper';

const boxMargin = { backgroundColor: '#00ccee' }
const bgImgStyle = {
    backgroundImage: "url(https://picsum.photos/2000/500)", /* The image used */
    backgroundColor: '#cccccc', /* Used if the image is unavailable */
    height: '16rem', /* You must set a specified height */
    backgroundPosition: 'center', /* Center the image */
    backgroundRepeat: 'no-repeat', /* Do not repeat the image */
    backgroundSize: 'cover' /* Resize the background image to cover the entire container */
}

export default function MyGroupsPage() {
    return (
        <Protected>
            <Container sx={bgImgStyle}>
                DUH
            </Container>
            <Container maxWidth="sm" sx={boxMargin}>
                <Box sx={{ my: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        My Groups Page
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