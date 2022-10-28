import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar';
import EditIcon from '@mui/icons-material/ManageAccounts';
import { makeImageUrl } from '../utils/image-helper'
import styles from './MemberCard.module.css'
import Link from './Link';
import { Chip } from '@mui/material';
import MemberMenu from './MemberMenu';
import { useState } from 'react';

const MemberName = ({ name }) => {
    return (name.length > 26) ?
        <Tooltip title={name} arrow>
            <Typography variant='subtitle1' className={styles.memberName}>{name}</Typography>
        </Tooltip>
        : <Typography variant='subtitle1' className={styles.memberName}>{name}</Typography>
}

const MemberCard = ({
    groupId,
    memberPK, name, email, since = 'ooit',
    photoUrl,
    userRole = 'guest', isFounder = false,
    status = 'active',
    isCurrent = false,
    options = []
}) => {
    const memberId = memberPK.slice(2);
    const src = makeImageUrl(photoUrl, 128);
    const hasOptions = (options.length > 0);

    const [anchor, setAnchor] = useState({ el: null })
    const onClickMenu = (e) => setAnchor({ el: e.target })

    return <Paper className={styles.memberCard}>
        <Avatar className={styles.avatar} src={src}>{name.slice(0, 2)}</Avatar>
        <div className={styles.wrapper}>
            <div className={styles.chips}>
                {(isCurrent) && <Chip size='small' label='me!' />}
                {(isFounder) && <Chip size='small' label='oprichter' color='primary' />}
                {(status === 'invite') && <Typography variant='caption'>
                    {(userRole === 'admin') ? '(admin)' : '(gast)'}
                </Typography>}
                <div className={styles.filler} />
                <IconButton className={styles.editButton} color='primary' disabled={!hasOptions}
                    onClick={onClickMenu}
                >
                    {(hasOptions) && <EditIcon />}
                </IconButton>
            </div>
            <MemberName name={name} />
            <Link href={`mailto:${email}`}><Typography variant='body2' gutterBottom>{email}</Typography></Link>
            <Typography variant='caption'>
                {(status === 'active') ?
                    `Lid sinds ${since.slice(0, 4)}`
                    : `Uitgenodigd op ${since}`}
                {/* {(photoCount !== undefined) && ` · ${photoCount || 'geen'} foto${(photoCount !== 1) && "'s"}`} */}
            </Typography>
        </div>
        <MemberMenu anchor={anchor} setAnchor={setAnchor}
            groupId={groupId} options={options} memberId={memberId} userRole={userRole}/>
    </Paper>
}

MemberCard.whyDidYouRender = true

export default MemberCard