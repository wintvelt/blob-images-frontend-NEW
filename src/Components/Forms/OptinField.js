import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useController } from "react-hook-form";
import { FormHelperText, Typography } from '@mui/material';
import Link from '../Link';

const Label = () => (
    <Typography variant='body2'>
        Ik ben akkoord met de {' '}
        <Link href='/termsandconditions'>algemene voorwaarden</Link>
    </Typography>
)

function OptinField({ control }) {
    const {
        field: { onChange, onBlur, name, value, ref },
        fieldState: { invalid, isTouched, isDirty },
        formState: { errors }
    } = useController({
        name: "optin",
        control,
        rules: { required: true },
        defaultValue: "",
    });

    const helperText = (errors.name) ?
        // (errors.name.type === 'required') ?
        "Om lid te worden moet je akkoord geven"
        : " ";

    const color = (errors.optin) ? t => t.palette.error.main : 'default'
    return (
        <>
            <FormControlLabel
                control={<Checkbox size='small' sx={{ color }} />}
                label={<Label />}
                onChange={onChange} // send value to hook form 
                onBlur={onBlur} // notify when input is touched/blur
                value={value} // input value
                name={name} // send down the input name
                inputRef={ref} // send input ref, so we can focus on input when error appear
                margin="dense"
                required
                id="optin"
                autoComplete="off"
            />
            <FormHelperText error={!!(errors[name])}>{helperText}</FormHelperText>
        </>
    );
}

export default OptinField;