import { Badge } from '@mui/material';
import Typography from '@mui/material/Typography'
import { makeImageUrl } from '../utils/image-helper'
import styles from './AlbumCard.module.css'
import Link from './Link';

const AlbumCard = ({
  groupId,
  albumId,
  name = 'Een Album',
  since = 'ooit',
  photoUrl,
  newPicsCount,
  photoCount,
}) => {
  const src = makeImageUrl(photoUrl, 500);
  const albumLink = `/groups/${groupId}/albums/${albumId}`
  return <Badge className={styles.badge} badgeContent={newPicsCount} color='secondary'>
    <Link noStyleStyle className={styles.album} href={albumLink} sx={{ backgroundImage: `url(${src})` }}>
      <div className={styles.overlay} >
        <Typography variant='h5'>
          {name}
        </Typography>
        <Typography variant='caption'>
          Sinds {since.slice(0, 4)}
          {(photoCount !== undefined) && ` · ${photoCount || 'geen'} foto${(photoCount !== 1) && "'s"}`}
        </Typography>
      </div>
    </Link>
  </Badge>
}

export default AlbumCard