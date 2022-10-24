import { Badge } from '@mui/material';
import Typography from '@mui/material/Typography'
import { makeImageUrl } from '../utils/image-helper'
import styles from './Groupcard.module.css'
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
  const src = makeImageUrl(photoUrl, 240, 240);
  const groupLink = `/groups/${groupId}`
  return <Badge badgeContent={newPicsCount} color='secondary'>
    <Link noStyleStyle className={styles.figure} href={groupLink}>
      <div className={styles.imageframe}>
        <img className={styles.img} src={src} />
        <figcaption className={styles.figcaption}>
          <Typography variant='h5'>
            {name}
          </Typography>
          <Typography variant='caption'>
            Sinds {since.slice(0, 4)}
            {(memberCount) &&  ` · ${memberCount} leden`}
            {(albumCount) && ` · ${albumCount} albums`}
          </Typography>
        </figcaption>
      </div>
    </Link>
  </Badge>
}

export default GroupCard