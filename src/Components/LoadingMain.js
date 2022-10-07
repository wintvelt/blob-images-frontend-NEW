import { CircularProgress, Typography } from "@mui/material";
import Box from "@mui/material/Box";

const boxStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 'calc(100vh - 64px)'
}

const innerBoxStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'gray'
}

export default function LoadingMain() {
    return <Box sx={boxStyle}>
        <Box sx={innerBoxStyle}>
            <Typography variant='h4' component='h1' gutterBottom>
                Loading...
            </Typography>
            <CircularProgress color="inherit"/>
        </Box>
    </Box>
}