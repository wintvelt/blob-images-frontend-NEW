import TextField from '@mui/material/TextField';
import { useController } from "react-hook-form";

function NameField({ control, fieldName = 'name', size = 'normal',
    reqHelper = 'Vul je naam in' }) {
    const {
        field: { onChange, onBlur, name, value, ref },
        fieldState: { invalid, isTouched, isDirty },
        formState: { errors }
    } = useController({
        name: fieldName,
        control,
        rules: { required: true },
        defaultValue: "",
    });

    // NB Not really clean: works only if fieldName is in shape 'something.3.something'
    const frags = fieldName.split('.')
    const fieldErrors = (frags.length === 3) ?
        errors[frags[0]] &&
        errors[frags[0]][parseInt(frags[1])] &&
        errors[frags[0]][parseInt(frags[1])][frags[2]]
        : errors[fieldName];

    const helperText = (fieldErrors) ?
        // (errors.name.type === 'required') ?
        reqHelper
        : " ";

    return (
        <TextField
            size={size}
            type="text"
            onChange={onChange} // send value to hook form 
            onBlur={onBlur} // notify when input is touched/blur
            value={value} // input value
            name={name} // send down the input name
            inputRef={ref} // send input ref, so we can focus on input when error appear
            helperText={helperText}
            error={!!(fieldErrors)}
            margin="dense"
            required
            fullWidth
            data-cy={fieldName}
            label="Naam"
            autoComplete="name"
        />
    );
}

export default NameField;