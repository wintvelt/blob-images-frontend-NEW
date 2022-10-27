import * as React from 'react';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { keyframes } from '@mui/system';

const fadeIn = keyframes`
    0% {
        opacity: 0;
    }
    50% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
`;

const loadingStyle = {
    p: 4,
    color: '#aaaaaa',
    animation: `${fadeIn} 2s`
}

function LoadingBlock() {
    return <Container maxWidth='lg'>
        <Typography variant='h3' component='h1' align='center' sx={loadingStyle}>
            <CircularProgress color='inherit' />{' '}Laden...
        </Typography>
    </Container>
}

export default LoadingBlock;