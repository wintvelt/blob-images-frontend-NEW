import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";

// TODO: layout, clickability, and badge
// put css in module
// use photo component, to make it reusable for non-album photos too

export default function Photo() {
    return <ImageListItem key={photo.SK} sx={{ overflow: 'hidden' }}>
        <img src={makeImageUrl(photo.photo.url, 300)} />
        <ImageListItemBar position='bottom' title={i} />
    </ImageListItem>
}