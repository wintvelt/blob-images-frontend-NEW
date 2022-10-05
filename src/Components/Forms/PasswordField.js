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

function PasswordField({ control }) {
    const {
        field: { onChange, onBlur, name, value, ref },
        fieldState: { invalid, isTouched, isDirty },
        formState: { errors }
    } = useController({
        name: "password",
        control,
        rules: { required: true },
        defaultValue: "",
    });
    const [visible, setVisible] = useState(false);
    const onClickVisibility = () => setVisible(!visible)

    const helperText = (errors.password) ?
        (errors.password.type === 'required') ?
            "Vul je wachtwoord in"
            // errors.password.type === 'custom'
            : errors.password.message
        : " ";

    return (
        <FormControl variant='outlined' fullWidth margin="dense">
            <InputLabel
                htmlFor="outlined-adornment-password"
                error={(!!errors.password)}
            >
                Wachtwoord *
            </InputLabel>
            <OutlinedInput
                type={(visible) ? "text" : "password"}
                onChange={onChange} // send value to hook form 
                onBlur={onBlur} // notify when input is touched/blur
                value={value} // input value
                name={name} // send down the input name
                inputRef={ref} // send input ref, so we can focus on input when error appear
                error={!!(errors.password)}
                // margin="normal"
                required
                fullWidth
                id="password"
                label="Wachtwoord *"
                autoComplete="password"
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
            <FormHelperText error={!!(errors.password)}>{helperText}</FormHelperText>
        </FormControl>
    );
}

export default PasswordField;