import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
    palette: {
        primary: {
            main: '#373a6d',
            light: '#64649c',
            dark: '#061541',
            contrastText: '#fff',
        },
        secondary: {
            main: '#fb8c00',
            light: '#ffbd45',
            dark: '#c25e00',
            contrastText: '#000',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#e9f6f8'
        }
    },
    typography: {
        fontFamily: [
            'Raleway',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
});

export default theme;