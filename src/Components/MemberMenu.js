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

function MemberMenu({ anchor, setAnchor, groupId }) {
    const options = anchor.options || [];
    const queryClient = useQueryClient(); // to refetch members
    const router = useRouter(); // to leave page after leaving group

    const [dialog, setDialog] = useState('');
    const [dialogLines, submitText] = makeDialogItems(dialog)

    const handleClose = () => {
        setAnchor({ el: null });
        setDialog('');
    };

    const onItemClick = (action) => () => setDialog(action);
    const onConfirm = async () => {
        const apiPath = `/groups/${groupId}/membership/${anchor.memberId}`;
        switch (dialog) {
            case 'leave': {
                try {
                    await API.del('blob-images', apiPath);
                    queryClient.invalidateQueries(['groups']);
                    queryClient.invalidateQueries([groupId]);
                    toast.info('Je hebt de groep verlaten');
                    router.push('/groups');
                } catch (error) {
                    console.error(error.response?.data?.error)
                    toast.error('Groepsexit is niet gelukt');
                    handleClose();
                }
                break;
            }
            case 'founderify': {
                break;
            }
            case 'ban': {
                break;
            }
            case 'uninvite': {
                break;
            }
            default:
                break;
        }
    };
    const onChangeRole = () => {
        // TODO
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