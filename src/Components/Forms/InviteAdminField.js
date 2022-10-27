import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useController } from "react-hook-form";
import { FormHelperText, Typography } from '@mui/material';
import Link from '../Link';

const Label = () => (
    <Typography variant='caption'>admin</Typography>
)

export default function InviteAdminField({ control, fieldName = "admin", showLabel = true }) {
    const {
        field: { onChange, onBlur, name, value, ref },
        fieldState: { invalid, isTouched, isDirty },
        formState: { errors }
    } = useController({
        name: fieldName,
        control,
        defaultValue: true,
    });

    const helperText = "";

    const checkStyle = {
        padding: 0,
        color: (errors[fieldName]) ? t => t.palette.error.main : 'default'
    }
    return (
        <>
            <FormControlLabel
                control={<Checkbox size='small' sx={checkStyle} checked={value} />}
                label={(showLabel) && <Label />}
                labelPlacement='top'
                onChange={onChange} // send value to hook form 
                onBlur={onBlur} // notify when input is touched/blur
                value={value} // input value
                name={name} // send down the input name
                inputRef={ref} // send input ref, so we can focus on input when error appear
                sx={{ mx: 0, width: '100%', mt: (showLabel) ? -0.9 : 2 }}
                data-cy={fieldName}
                autoComplete="off"
            />
            <FormHelperText error={!!(errors[name])}>{helperText}</FormHelperText>
        </>
    );
}