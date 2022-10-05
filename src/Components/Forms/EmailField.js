import TextField from '@mui/material/TextField';
import { useController } from "react-hook-form";

const emailValidationRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

function EmailField({ control }) {
    const {
        field: { onChange, onBlur, name, value, ref },
        fieldState: { invalid, isTouched, isDirty },
        formState: { errors }
    } = useController({
        name: "email",
        control,
        rules: { required: true, pattern: emailValidationRegex },
        defaultValue: "",
    });

    const helperText = (errors.email) ?
        // (errors.email.type === 'required' || errors.email.type === 'pattern') ?
        "Vul een geldig email adres in"
        : (errors.password?.type === 'custom') ? errors.password.message
            : " ";

    return (
        <TextField
            type="email"
            onChange={onChange} // send value to hook form 
            onBlur={onBlur} // notify when input is touched/blur
            value={value} // input value
            name={name} // send down the input name
            inputRef={ref} // send input ref, so we can focus on input when error appear
            helperText={helperText}
            error={!!(errors.email || errors.password?.type === 'custom')}
            margin="dense"
            required
            fullWidth
            id="email"
            label="Email adres"
            autoComplete="email"
        />
    );
}

export default EmailField;