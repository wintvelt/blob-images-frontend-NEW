import * as React from 'react';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Link from './Link';

// to prevent rerenders
const sxMy1 = { my: 1 }
const sxMt1 = { mt: 1 }

const ErrorBlock = ({ error, groupId, user }) => {
    const title =
        (error === 'invite ID invalid') ? 'Ongeldige uitnodigingscode'
            : (error === 'invite not found') ? 'Uitnodiging niet gevonden'
                : (error === 'invite not for you') ?
                    (user.isAuthenticated) ? 'Uitnodiging is niet voor jou' : 'Uitnodiging is voor een lid'
                    : (error === 'invite already accepted') ? 'Uitnodiging al geaccepteerd'
                        : (error === 'invite expired') ? 'Uitnodiging verlopen'
                            : 'Fout bij ophalen uitnodiging';
    const lines =
        (error === 'invite ID invalid') ? ['De uitnodigingscode in de url is ongeldig',
            'Klik op de link in de email met de uitnodiging', 'of kopieer de link naar de browser']
            : (error === 'invite not found') ? ['Deze uitnodiging bestaat niet (meer)',
                'Misschien is bijbehorende groep ondertussen opgeheven',
                'Je kunt het beste degene die je heeft uitgenodigd direct benaderen als je uitnodigingsmail nog hebt']
                : (error === 'invite not for you') ?
                    (user.isAuthenticated) ? ['Deze uitnodiging is direct geadresseerd aan een ander lid',
                        'Waarschijnlijk niet voor jou, of je moet onder een ander account inloggen']
                        : ['Deze uitnodiging is direct geadresseerd aan iemand die al een account heeft',
                            'Log in om de uitnodiging op te halen']
                    : (error === 'invite already accepted') ? ['Je hebt deze uitnodiging al geaccepteerd',
                        'Dus je bent al lid', 'De groep uit deze uitnodiging staat al tussen je groepen']
                        : (error === 'invite expired') ? ['Deze uitnodiging is verlopen',
                            'Je kunt het beste degene die je heeft uitgenodigd direct benaderen,',
                            'als je de email met de uitnodiging nog hebt']
                            : ['Er ging iets mis bij het ophalen van de uitnodiging', 'Probeer het later nog eens'];

    const [href, linkText] = (error === 'invite already accepted') ?
        (groupId) ? [`/groups/${groupId}`, '→ Bekijk de groep'] : ['/groups', '→ Ga naar mijn groepen']
        : (error === 'invite not for you' && !user.isAuthenticated) ?
            ['/login', '→ Log in']
            : ['', ''];

    return <>
        <Avatar width={40} height={40}>😳</Avatar>
        <Typography variant="h4" align='center' component="h1" sx={sxMt1}
            gutterBottom data-cy={error}>
            {title}
        </Typography>
        <Typography variant="body1" align='center' sx={sxMy1} gutterBottom>
            {lines.map((line, i) => (
                <React.Fragment key={i}>{line}<br /></React.Fragment>
            ))}
        </Typography>
        {href && <Link href={href} data-cy='errorlink'>{linkText}</Link>}
    </>
}

export default ErrorBlock;