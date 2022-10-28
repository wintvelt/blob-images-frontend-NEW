import { useState } from 'react';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteDialog from './DeleteDialog';
import { makeDialogItems } from '../utils/dialog-helper';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { API } from 'aws-amplify';
import { toast } from 'react-toastify';

const redStyle = { color: t => t.palette.error.main };

function MemberMenu({ anchor, setAnchor, groupId, options = [], userRole, memberId }) {
    const queryClient = useQueryClient(); // to refetch members
    const router = useRouter(); // to leave page after leaving group

    const [dialog, setDialog] = useState('');
    const [dialogLines, submitText] = makeDialogItems(dialog)

    const handleClose = () => {
        setAnchor({ el: null });
        setDialog('');
    };

    const apiPath = `/groups/${groupId}/membership/${memberId}`;

    const onItemClick = (action) => () => setDialog(action);
    const onConfirm = async () => {
        if (['leave', 'ban', 'uninvite'].includes(dialog)) {
            try {
                await API.del('blob-images', apiPath);
                if (dialog === 'leave') {
                    queryClient.invalidateQueries(['groups']); // remove left group from list
                    queryClient.invalidateQueries([groupId]); // no rights to this group (or albums etc)
                } else {
                    queryClient.invalidateQueries(['members']); // only member list needs updating
                }
                const message = (dialog === 'leave') ? 'Je hebt de groep verlaten'
                    : 'Het lid is uit de groep verwijderd';
                toast.info(message);
                if (dialog === 'leave') router.push('/groups');
            } catch (error) {
                console.error(error.response?.data?.error)
                toast.error('Groepsexit is niet gelukt');
            }
        } else { // dialog = founderify
            try {
                await API.put('blob-images', apiPath, {
                    body: { makeFounder: true }
                });
                queryClient.invalidateQueries(['members']); // change member status of me + new founder
                toast.info('Oprichterstatus is succesvol verhuisd');
            } catch (error) {
                console.error(error.response?.data?.error)
                toast.error('Kon oprichterstatus niet verhuizen 😢');
            }
        }
        handleClose();
    };
    const onChangeRole = async () => {
        try {
            const newRole = (userRole === 'admin') ? 'guest' : 'admin';
            await API.put('blob-images', apiPath, {
                body: { newRole }
            });
            queryClient.invalidateQueries(['members']); // change member role (and position in list)
            toast.info('Rol van het lid is aangepast');
        } catch (error) {
            console.error(error.response?.data?.error)
            toast.error('Niet gelukt om rol van dit lid aan te passen');
        }
        handleClose();
    };
    const open = Boolean(anchor.el)
    return <>
        <Menu
            id="member-menu"
            data-cy="member-menu"
            anchorEl={anchor.el}
            keepMounted
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            {options.includes('leave') &&
                <MenuItem onClick={onItemClick('leave')}>Groep verlaten</MenuItem>}
            {options.includes('guestify') &&
                <MenuItem onClick={onChangeRole}>Maak gast</MenuItem>
            }
            {options.includes('adminify') &&
                <MenuItem onClick={onChangeRole}>Maak admin</MenuItem>
            }
            {options.includes('founderify') &&
                <MenuItem onClick={onItemClick('founderify')}>Benoem als oprichter</MenuItem>
            }
            {options.includes('ban') &&
                <MenuItem sx={redStyle} onClick={onItemClick('ban')}>Verban uit groep</MenuItem>}
            {options.includes('uninvite') &&
                <MenuItem sx={redStyle} onClick={onItemClick('uninvite')}>
                    Toch niet uitnodigen
                </MenuItem>}
        </Menu>
        <DeleteDialog
            open={!!dialog}
            onClose={handleClose}
            onDelete={onConfirm}
            title='Weet je het zeker?'
            lines={dialogLines}
            abortText='Oh, toch maar niet'
            submitText={submitText}
        />
    </>
}

MemberMenu.whyDidYouRender = true

export default MemberMenu