import '../scripts/wdyr'

import * as React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';
import NavBar from '../src/Components/NavBar/NavBar';
import Copyright from '../src/Copyright';
import Toolbar from '@mui/material/Toolbar';
import { UserProvider } from '../src/Components/UserContext';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.min.css';
import { useRouter } from 'next/router';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const stringUntilQ = (str) => str.slice(0,(str.indexOf('?')>=0)? str.indexOf('?') : str.length)

export default function MyApp(props) {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
    const router = useRouter();
    React.useEffect(() => {
        if (router.isReady && router.query.toast) {
            toast.info(router.query.toast)
        }
    }, [router.isReady, router.pathname])
    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <title>{`Clubalmanac ${stringUntilQ(router.pathname)}`}</title>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <UserProvider>
                    <NavBar />
                    <Toolbar />
                    <Component {...pageProps} />
                    <Copyright />
                    <ToastContainer />
                </UserProvider>
            </ThemeProvider>
        </CacheProvider>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    emotionCache: PropTypes.object,
    pageProps: PropTypes.object.isRequired,
};