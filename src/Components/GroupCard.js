import { Badge } from '@mui/material';
import Typography from '@mui/material/Typography'
import { makeImageUrl } from '../utils/image-helper'
import styles from './GroupCard.module.css'
import Link from './Link';

const GroupCard = ({
  groupId,
  name = 'Een groep',
  since = 'ooit',
  photoUrl,
  newPicsCount = 0,
  memberCount,
  albumCount
}) => {
  const src = makeImageUrl(photoUrl, 900);
  const groupLink = `/groups/${groupId}`
  return <Badge className={styles.badge} badgeContent={newPicsCount} color='secondary'>
    <Link noLinkStyle className={styles.figure} href={groupLink}>
      <div className={styles.imageframe} data-cy={`${groupId} groupcard`}>
        <img className={styles.img} src={src} />
        <figcaption className={styles.figcaption}>
          <Typography variant='h5'>
            {name}
          </Typography>
          <Typography variant='caption'>
            Sinds {since.slice(0, 4)}
            {(memberCount) && ` · ${memberCount} ${(memberCount === 1) ? 'lid' : 'leden'}`}
            {(albumCount) && ` · ${albumCount} album${(album !== 1) && "s"}`}
          </Typography>
        </figcaption>
      </div>
    </Link>
  </Badge>
}

export default GroupCard