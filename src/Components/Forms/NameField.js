import TextField from '@mui/material/TextField';
import { useController } from "react-hook-form";

function NameField({ control }) {
    const {
        field: { onChange, onBlur, name, value, ref },
        fieldState: { invalid, isTouched, isDirty },
        formState: { errors }
    } = useController({
        name: "name",
        control,
        rules: { required: true },
        defaultValue: "",
    });

    const helperText = (errors.name) ?
        // (errors.name.type === 'required') ?
        "Vul je naam in"
        : " ";

    return (
        <TextField
            type="text"
            onChange={onChange} // send value to hook form 
            onBlur={onBlur} // notify when input is touched/blur
            value={value} // input value
            name={name} // send down the input name
            inputRef={ref} // send input ref, so we can focus on input when error appear
            helperText={helperText}
            error={!!(errors.name)}
            margin="dense"
            required
            fullWidth
            id="name"
            label="Naam"
            autoComplete="name"
        />
    );
}

export default NameField;