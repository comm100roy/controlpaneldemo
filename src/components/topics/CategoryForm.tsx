import { Button, MenuItem, Stack, TextField } from '@mui/material'

export type CategoryFormValues = {
  name: string
  parentId: string
}

export type CategoryFormOption = {
  id: string
  label: string
}

type CategoryFormProps = {
  values: CategoryFormValues
  parentOptions: CategoryFormOption[]
  submitLabel?: string
  onChange: (nextValues: CategoryFormValues) => void
  onSubmit: () => void
  onCancel: () => void
  isSubmitDisabled?: boolean
}

function CategoryForm({
  values,
  parentOptions,
  submitLabel = 'Save',
  onChange,
  onSubmit,
  onCancel,
  isSubmitDisabled = false,
}: CategoryFormProps) {
  return (
    <Stack spacing={3}>
      <TextField
        fullWidth
        required
        label="Name"
        value={values.name}
        onChange={(event) => onChange({ ...values, name: event.target.value })}
      />

      <TextField
        select
        fullWidth
        required
        label="Parent"
        value={values.parentId}
        onChange={(event) => onChange({ ...values, parentId: event.target.value })}
      >
        {parentOptions.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <Stack direction="row" spacing={2}>
        <Button variant="contained" disabled={isSubmitDisabled} onClick={onSubmit}>
          {submitLabel}
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Stack>
    </Stack>
  )
}

export default CategoryForm
