import TextField from '@mui/material/TextField';
import { useController, useFormContext } from "react-hook-form";

const emailValidationRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
const baseValidations = { required: true, pattern: emailValidationRegex }
const BASENAME = 'inviteeEmail'
const fieldsToCompare = (fieldName) => {
    // NB Not really clean: works only if fieldName is in shape 'something.3.something'
    const fragments = fieldName.split('.')
    if (fragments.length < 3) return [];
    let outArr = [BASENAME];
    const count = parseInt(fragments[1]);
    for (let i = 0; i < count; i++) {
        const newName = `${fragments[0]}.${i}.${fragments[2]}`;
        outArr.push(newName);
    }
    return outArr
}

function EmailField({ control, fieldName = 'email', size = 'normal', getValues, memberMails }) {
    const validations = (getValues || memberMails) ?
        {
            ...baseValidations,
            validate: {
                duplicate: (v) => (!getValues || !getValues(fieldsToCompare(fieldName)).includes(v)),
                ismember: (v) => (!memberMails || !memberMails.includes(v)),
            }
        } : baseValidations;
    const {
        field: { onChange, onBlur, name, value, ref },
        fieldState: { invalid, isTouched, isDirty },
        formState: { errors }
    } = useController({
        name: fieldName,
        control,
        rules: validations,
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
        (fieldErrors.type === 'duplicate') ?
            'Dubbel email adres'
            // (errors.email.type === 'required' || errors.email.type === 'pattern') ?
            : (fieldErrors.type === 'ismember') ?
                "Er is al een lid met dit adres"
                : "Vul een geldig email adres in"
        : (errors.password?.type === 'custom') ? errors.password.message
            : " ";

    return (
        <TextField
            size={size}
            type="email"
            onChange={onChange} // send value to hook form 
            onBlur={onBlur} // notify when input is touched/blur
            value={value} // input value
            name={name} // send down the input name
            inputRef={ref} // send input ref, so we can focus on input when error appear
            helperText={helperText}
            error={!!(fieldErrors || errors.password?.type === 'custom')}
            margin="dense"
            required
            fullWidth
            data-cy={fieldName}
            label="Email adres"
            autoComplete="email"
        />
    );
}

export default EmailField;