import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import MuiLink from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import { useUser } from './Components/UserContext';
import { toast } from 'react-toastify';
import { isProtectedRoute } from './utils/route-helper';

// Add support for the sx prop for consistency with the other branches.
const Anchor = styled('a')({});

export const NextLinkComposed = React.forwardRef(function NextLinkComposed(props, ref) {
    const { to, linkAs, replace, scroll, shallow, prefetch, locale, ...other } = props;

    return (
        <NextLink
            href={to}
            prefetch={prefetch}
            as={linkAs}
            replace={replace}
            scroll={scroll}
            shallow={shallow}
            passHref
            locale={locale}
        >
            <Anchor ref={ref} {...other} />
        </NextLink>
    );
});

NextLinkComposed.propTypes = {
    href: PropTypes.any,
    linkAs: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    locale: PropTypes.string,
    passHref: PropTypes.bool,
    prefetch: PropTypes.bool,
    replace: PropTypes.bool,
    scroll: PropTypes.bool,
    shallow: PropTypes.bool,
    to: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
};

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/api-reference/next/link
const Link = React.forwardRef(function Link(props, ref) {
    const {
        activeClassName = 'active',
        as,
        className: classNameProps,
        href,
        linkAs: linkAsProp,
        locale,
        noLinkStyle,
        prefetch,
        replace,
        role, // Link don't have roles.
        scroll,
        shallow,
        isProtected,
        ...other
    } = props;

    const router = useRouter();
    const { user } = useUser()

    const onProtectedClick = async (e) => {
        if (!isProtected && !isProtectedRoute(href)) return
        if (!user.isAuthenticated) {
            toast.error('Log eerst even in', { toastId: 'login-required' })
            e.preventDefault()
        }
    }

    const pathname = typeof href === 'string' ? href : href.pathname;
    const className = clsx(classNameProps, {
        [activeClassName]: router.pathname === pathname && activeClassName,
    });

    const isExternal =
        typeof href === 'string' && (href.indexOf('http') === 0 || href.indexOf('mailto:') === 0);

    if (isExternal) {
        if (noLinkStyle) {
            return <Anchor className={className} href={href} ref={ref} {...other} />;
        }

        return <MuiLink className={className} href={href} ref={ref} {...other} />;
    }

    const linkAs = linkAsProp || as;
    const nextjsProps = { to: href, linkAs, replace, scroll, shallow, prefetch, locale };

    if (noLinkStyle) {
        return <NextLinkComposed 
        className={className} 
        ref={ref} 
        {...nextjsProps} 
        {...other} 
        onClick={onProtectedClick}
        />;
    }

    return (
        <MuiLink
            component={NextLinkComposed}
            className={className}
            ref={ref}
            {...nextjsProps}
            {...other}
            onClick={onProtectedClick}
        />
    );
});

Link.propTypes = {
    activeClassName: PropTypes.string,
    as: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    className: PropTypes.string,
    href: PropTypes.any,
    linkAs: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    locale: PropTypes.string,
    noLinkStyle: PropTypes.bool,
    prefetch: PropTypes.bool,
    isProtected: PropTypes.bool,
    replace: PropTypes.bool,
    role: PropTypes.string,
    scroll: PropTypes.bool,
    shallow: PropTypes.bool,
};

export default Link;

// add intervening check on Auth for internal links to protected pages
export const ProtectedLink = React.forwardRef(function ProtectedLink(props, ref) {
    return <Link ref={ref} isProtected={true} {...props} />
});