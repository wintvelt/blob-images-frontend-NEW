import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Clear';

const deleteStyle = {
    color: 'white',
    borderColor: t => t.palette.error.main,
    backgroundColor: t => t.palette.error.main,
    my: 2,
    marginRight: 2,
};

const flexCenter = { display: 'flex', alignItems: 'center' };
const flexGrow = { flexGrow: 1 };

const DeleteDialog = ({ open, onClose, onDelete, title, lines, abortText, submitText }) => {
    return <Dialog open={open} onClose={onClose} aria-labelledby="dialog-confirm-deletion"
        fullWidth maxWidth='sm'>
        <DialogTitle id="image-upload-dialog" sx={flexCenter}>
            <Typography variant='h6' component='span' sx={flexGrow}>{title}</Typography>
            <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
            {lines.map((line, i) =>
                <Typography key={i} variant='body1' gutterBottom>
                    {line}
                </Typography>
            )}
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>
                {abortText}
            </Button>
            <Button onClick={onDelete} variant='contained' color='secondary'
                sx={deleteStyle}>
                {submitText}
            </Button>
        </DialogActions>
    </Dialog>
};

export default DeleteDialog;