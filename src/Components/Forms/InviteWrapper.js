import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

export default function InviteWrapper({ background = '/invite-bg.jpg', narrow = false, children }) {
    return (
        <Grid container component="main" sx={{ minHeight: 'calc(100vh - 64px)' }}>
            <Grid
                item
                xs={false}
                sm={(narrow) ? false : 3}
                md={(narrow) ? 4 : 6}
                sx={{
                    backgroundImage: `url(${background})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid item
                xs={12}
                sm={(narrow) ? 12 : 9}
                md={(narrow) ? 8 : 6}
                component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: { xs: 1, md: 4 },
                        px: { xs: 0, md: 2, lg: 8 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {children}
                </Box>
            </Grid>
        </Grid>
    );
}