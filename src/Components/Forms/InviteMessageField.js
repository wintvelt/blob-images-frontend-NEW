import TextField from '@mui/material/TextField';
import { useController } from "react-hook-form";

export default function InviteMessageField({ control, fieldName = 'name', size = 'normal' }) {
    const {
        field: { onChange, onBlur, name, value, ref },
        fieldState: { invalid, isTouched, isDirty },
        formState: { errors }
    } = useController({
        name: fieldName,
        control,
        rules: { required: true },
        defaultValue: ""
    });

    const helperText = (errors[fieldName]) ?
        // (errors.name.type === 'required') ?
        "Je kunt alleen iemand uitnodigen als je tekst hebt"
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
            error={!!(errors[fieldName])}
            margin="dense"
            required
            fullWidth
            data-cy={fieldName}
            label="Uitnodigingstekst"
            placeholder="Vul hier jouw tekst in"
            multiline
            rows={8}
            autoComplete="message"
        />
    );
}