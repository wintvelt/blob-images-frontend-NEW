// used in SSR to populate props with route info
export const getSSRRoute = (context) => {
    const path = context.resolvedUrl;
    const pathSegments = path.split('?')[0].split('/')
    const groupIdx = pathSegments.findIndex(v => (v === 'groups'))
    const groupId = pathSegments[groupIdx + 1] || null
    const albumIdx = pathSegments.findIndex(v => (v === 'albums'))
    const albumId = pathSegments[albumIdx + 1] || null

    const backRoute = (pathSegments.length < 3) ?
        '/'
        : (pathSegments.slice(-2)[0] === 'albums') ?
            pathSegments.slice(0, -2).join('/')
            : pathSegments.slice(0, -1).join('/')
    return { groupId, albumId, path, backRoute }
}

// used to identify protected route
// for intercepting links
// for redirecting to home on logout
export const isProtectedRoute = (pathname = '/') => {
    return pathname.includes('/groups/')
        || pathname.includes('/albums/')
        || pathname.includes('/about')
}