export const makeDialogItems = (state) => {
    switch (state) {
        case 'ban': {
            return [
                ['Als je een lid uit de groep verwijdert, verdwijnen ook alle foto\'s van deze persoon uit de groep',
                    'Dit is definitief en omomkeerbaar',
                    'Je kunt het lid wel weer opnieuw uitnodigen, maar dan moet diegene al die foto\'s weer opnieuw toevoegen'
                ],
                'Yes, verban dit lid'
            ];
        }
        case 'leave': {
            return [
                [
                    'Als je de groep verlaat, is dat definitief. Je foto\'s verdwijnen dan ook uit de groep',
                    'Je kunt een ander lid vragen om je opnieuw uit te nodigen',
                    'Foto\'s moet je dan wel opnieuw toevoegen'
                ],
                'Yes, verlaat groep'
            ]
        }
        case 'uninvite': {
            return [
                [
                    'Als je de uitnodiging intrekt, krijgt het aspirantlid hiervan bericht.'
                ],
                'Yes, trek uitnodiging in'
            ]
        }
        case 'founderify': {
            return [
                [
                    'Als je een ander lid oprichter maakt, dan krijgt deze geluksvogel ook admin rechten.',
                    'En het recht om de groep op te heffen en te verwijderen van clubalmanac.',
                    'Jouw eigen status als oprichter vervalt dan.'
                ],
                'Yes, maak oprichter'
            ]
        }

        default:
            return [[], ''];
    }
};