import TextField from '@mui/material/TextField';
import { useController } from "react-hook-form";

function CodeField({ control }) {
    const {
        field: { onChange, onBlur, name, value, ref },
        fieldState: { invalid, isTouched, isDirty },
        formState: { errors }
    } = useController({
        name: "code",
        control,
        rules: { required: true },
        defaultValue: "",
    });

    const helperText = (errors.code) ?
        (errors.code.type === 'required') ?
            "Vul de verificatiecode uit de email in"
            // otherwise, it is custom and should have message
            : errors.code.message
        : " ";

    return (
        <TextField
            type="tel"
            onChange={onChange} // send value to hook form 
            onBlur={onBlur} // notify when input is touched/blur
            value={value} // input value
            name={name} // send down the input name
            inputRef={ref} // send input ref, so we can focus on input when error appear
            helperText={helperText}
            error={!!(errors.code)}
            margin="dense"
            required
            fullWidth
            id="code"
            data-cy="code"
            label="Verificatiecode"
            autoComplete="off"
        />
    );
}

export default CodeField;