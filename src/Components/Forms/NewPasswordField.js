import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { useController } from "react-hook-form";
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { useState } from 'react';

const validate = {
    minUpperCase: (psw) => (psw && psw !== psw.toLowerCase()),
    minLowerCase: (psw) => (psw && psw !== psw.toUpperCase()),
    minNumber: (psw) => (psw && /\d/.test(psw)),
    minLength: (psw) => (psw && psw.length >= 8)
}

const PasswordHelper = ({ valId, helperText, value, errors, last = false }) => {
    const isValid = validate[valId](value);
    const isError = (!!errors.newPassword && !isValid)
    let textStyle = {
        mt: 0,
        color: (isValid) ? t => t.palette.success.main : 'inherit'
    }
    if (last) textStyle = { ...textStyle, mb: 1 }
    return <FormHelperText error={isError} sx={textStyle}>
        {helperText}
        {isValid && ' ✓'}
    </FormHelperText>
}

function NewPasswordField({ control }) {
    const {
        field: { onChange, onBlur, name, value, ref },
        fieldState: { invalid, isTouched, isDirty },
        formState: { errors }
    } = useController({
        name: "newPassword",
        control,
        rules: { validate },
        defaultValue: "",
    });
    const [visible, setVisible] = useState(false);
    const onClickVisibility = () => setVisible(!visible);

    return (
        <FormControl variant='outlined' fullWidth margin="dense">
            <InputLabel
                htmlFor="outlined-adornment-password"
                error={(!!errors.newPassword)}
            >
                Nieuw wachtwoord *
            </InputLabel>
            <OutlinedInput
                type={(visible) ? "text" : "password"}
                onChange={onChange} // send value to hook form 
                onBlur={onBlur} // notify when input is touched/blur
                value={value} // input value
                name={name} // send down the input name
                inputRef={ref} // send input ref, so we can focus on input when error appear
                error={!!(errors.newPassword)}
                // margin="normal"
                required
                fullWidth
                id="new-password"
                label="Nieuw wachtwoord *"
                autoComplete="new-password"
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={onClickVisibility}
                            // onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {visible ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
            />
            <PasswordHelper valId='minUpperCase' value={value} errors={errors}
                helperText='minstens 1 hoofdletter' />
            <PasswordHelper valId='minLowerCase' value={value} errors={errors}
                helperText='minstens 1 kleine letter' />
            <PasswordHelper valId='minNumber' value={value} errors={errors}
                helperText='minstens 1 cijfer' />
            <PasswordHelper valId='minLength' value={value} errors={errors}
                helperText='minimaal 8 tekens, voor de zekerheid' last={true} />
        </FormControl>
    );
}

export default NewPasswordField;