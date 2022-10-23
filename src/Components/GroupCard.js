import { Badge } from '@mui/material';
import Typography from '@mui/material/Typography'
import { makeImageUrl } from '../utils/image-helper'
import styles from './Groupcard.module.css'

const GroupCard = ({ name = 'Een groep', since = 'ooit', photoUrl, newPicsCount = 0 }) => {
  const src = makeImageUrl(photoUrl, 240, 240);
  return <Badge badgeContent={newPicsCount} color='secondary'>
    <figure className={styles.figure}>
      <div className={styles.imageframe}>
        <img className={styles.img} src={src} />
        <figcaption className={styles.figcaption}>
          <Typography variant='h6'>
            {name}
          </Typography>
          <Typography variant='caption'>
            Sinds {since.slice(0, 4)} · 15 leden · 14 albums
          </Typography>
        </figcaption>
      </div>
    </figure>
  </Badge>
}

export default GroupCard